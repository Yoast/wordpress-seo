(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var plugins = {
	usedKeywords: require( "./js/bundledPlugins/previouslyUsedKeywords" )
};

var helpers = {
	scoreToRating: require( "./js/interpreters/scoreToRating" )
};

module.exports = {
	Assessor: require( "./js/assessor" ),
	SEOAssessor: require( "./js/seoAssessor" ),
	ContentAssessor: require( "./js/contentAssessor" ),
	App: require( "./js/app" ),
	Pluggable: require( "./js/pluggable" ),
	Researcher: require( "./js/researcher" ),
	SnippetPreview: require( "./js/snippetPreview.js" ),

	Paper: require( "./js/values/paper" ),
	AssessmentResult: require( "./js/values/AssessmentResult" ),

	bundledPlugins: plugins,
	helpers: helpers
};

},{"./js/app":2,"./js/assessor":29,"./js/bundledPlugins/previouslyUsedKeywords":30,"./js/contentAssessor":40,"./js/interpreters/scoreToRating":49,"./js/pluggable":55,"./js/researcher":57,"./js/seoAssessor":94,"./js/snippetPreview.js":95,"./js/values/AssessmentResult":134,"./js/values/paper":136}],2:[function(require,module,exports){
/* jshint browser: true */

require( "./config/config.js" );
var SnippetPreview = require( "./snippetPreview.js" );

var defaultsDeep = require( "lodash/defaultsDeep" );
var isObject = require( "lodash/isObject" );
var isString = require( "lodash/isString" );
var MissingArgument = require( "./errors/missingArgument" );
var isUndefined = require( "lodash/isUndefined" );
var forEach = require( "lodash/forEach" );
var debounce = require( "lodash/debounce" );

var Jed = require( "jed" );

var isUndefined = require( 'lodash/isUndefined' );

/**
 * Returns the description placeholder for use in the description forms.
 *
 * @returns {string}
 */
function getDescriptionPlaceholder( l10n ) {
	var descriptionPlaceholder = '';

	if ( ! isUndefined( window.wpseoPostScraperL10n ) ) {
		descriptionPlaceholder = window.wpseoPostScraperL10n.metadesc_template;
	} else if ( ! isUndefined( window.wpseoTermScraperL10n ) ) {
		descriptionPlaceholder = window.wpseoTermScraperL10n.metadesc_template;
	}

	return descriptionPlaceholder;
}

module.exports = getDescriptionPlaceholder;

},{"lodash/isUndefined":200}],2:[function(require,module,exports){
var scoreToRating = require( 'yoastseo' ).helpers.scoreToRating;
var isUndefined = require( 'lodash/isUndefined' );

/**
 * Simple helper function that returns the indicator for a given total score
 *
 * @param {number} score The score from 0 to 100.
 * @returns {Object} The indicator for the given score.
 */
function getIndicatorForScore( score ) {
	// Scale because scoreToRating works from 0 to 10.
	score /= 10;

	var app = YoastSEO.app;
	var indicator = {
		className: '',
		screenReaderText: '',
		fullText: ''
	};

	if ( ! isUndefined( app.contentAssessorPresenter ) ) {
		indicator = app.contentAssessorPresenter.getIndicator( scoreToRating( score ) );
	}

	return indicator;
}

module.exports = getIndicatorForScore;

},{"lodash/isUndefined":200,"yoastseo":226}],3:[function(require,module,exports){
/* global wpseoPostScraperL10n, wpseoTermScraperL10n */

var isUndefined = require( 'lodash/isUndefined' );

/**
 * Returns the title placeholder for use in the title forms.
 *
 * @returns {string}
 */
function getTitlePlaceholder() {
	var titlePlaceholder = '';

	if ( ! isUndefined( window.wpseoPostScraperL10n ) ) {
		titlePlaceholder = window.wpseoPostScraperL10n.title_template;
	} else if ( ! isUndefined( window.wpseoTermScraperL10n ) ) {
		titlePlaceholder = window.wpseoTermScraperL10n.title_template;
	}

	if ( titlePlaceholder === '' ) {
		titlePlaceholder = '%%title%% - %%sitename%%';
	}

	return titlePlaceholder;
}

module.exports = getTitlePlaceholder;

},{"lodash/isUndefined":200}],4:[function(require,module,exports){
/* global wp, jQuery */

var isUndefined = require( 'lodash/isUndefined' );
var defaults = require( 'lodash/defaults' );

var $ = jQuery;

var defaultArguments = {
	keyword: '',
	prefix: '',
	basedOn: '',
	onActivate: function ( ) { },
	afterActivate: function ( ) { },
	active: false,

	scoreClass: 'na',
	scoreText: '',
	fallback: '',

	showKeyword: true,
	isKeywordTab: true
};

module.exports = (function() {
	'use strict';

	/**
	 * Constructor for a keyword tab object
	 * @param {Object} args
	 * @constructor
	 */
	function KeywordTab( args ) {
		defaults( args, defaultArguments );

		this.keyword = args.keyword;
		this.prefix  = args.prefix;
		this.basedOn = args.basedOn;
		this.onActivate = args.onActivate;
		this.afterActivate = args.afterActivate;
		this.active = args.active;
		this.scoreClass = args.scoreClass;
		this.scoreText = args.scoreText;

		this.showKeyword = args.showKeyword;
		this.isKeywordTab = args.isKeywordTab;
		this.fallback = args.fallback;
	}

	/**
	 * Initialize a keyword tab.
	 *
	 * @param {HTMLElement} parent
	 * @param {string} position Either prepend or append for the position in the parent.
	 */
	KeywordTab.prototype.init = function( parent, position ) {
		this.setElement( this.render() );
		var $parent = $( parent );

		if ( 'prepend' === position ) {
			$parent.prepend( this.element );
		} else {
			$parent.append( this.element );
		}
	};

	/**
	 * Updates the keyword tabs with new values.
	 *
	 * @param {string} scoreClass
	 * @param {string} scoreText
	 * @param {string=""} keyword
	 */
	KeywordTab.prototype.update = function( scoreClass, scoreText, keyword ) {
		if ( ! isUndefined( keyword ) ) {
			this.keyword = keyword;
		}
		this.setScoreClass( scoreClass );
		this.setScoreText( scoreText );
		this.refresh();
	};

	/**
	 * Renders a new keyword tab with the current values and replaces the old tab with this one.
	 */
	KeywordTab.prototype.refresh = function() {
		var newElem = this.render();

		this.element.replaceWith( newElem );
		this.setElement( newElem );
	};

	/**
	 * Renders this keyword tab as a jQuery HTML object.
	 *
	 * @returns {Object} jQuery HTML object.
	 */
	KeywordTab.prototype.render = function() {
		var placeholder = this.keyword.length > 0 ? this.keyword : '...';
		var prefix = this.prefix;

		if ( ! this.showKeyword ) {
			placeholder = '';
		}

		if ( '' === this.keyword && '' !== this.fallback ) {
			placeholder = this.fallback;
			prefix = '';
		} else {
			prefix += ' ';
		}

		var html = wp.template( 'keyword_tab' )({
			keyword: this.keyword,
			placeholder: placeholder,
			score: this.scoreClass,
			hideRemove: true,
			prefix: prefix,
			active: this.active,
			basedOn: this.basedOn,
			scoreText: this.scoreText,
			isKeywordTab: this.isKeywordTab
		});

		return jQuery( html );
	};

	/**
	 * Sets the current element
	 *
	 * @param {HTMLElement} element
	 */
	KeywordTab.prototype.setElement = function( element ) {
		this.element = jQuery( element );

		this.addEventHandler();
	};

	/**
	 * Formats the given score and store it in the attribute.
	 *
	 * @param {string} scoreClass
	 */
	KeywordTab.prototype.setScoreClass = function( scoreClass ) {
		this.scoreClass = scoreClass;
	};

	/**
	 * Formats the given score text and store it in the attribute.
	 *
	 * @param {string} scoreText
	 */
	KeywordTab.prototype.setScoreText = function( scoreText ) {
		this.scoreText = scoreText;
	};

	/**
	 * Adds event handler to tab
	 */
	KeywordTab.prototype.addEventHandler = function() {
		$( this.element ).on( 'click', this.onClick.bind( this ) );
	};

	/**
	 * Activates the tab
	 */
	KeywordTab.prototype.activate = function() {
		this.onActivate();

		$( '.wpseo_keyword_tab, .wpseo_content_tab' ).removeClass( 'active' );
		this.active = true;
		this.refresh();

		this.afterActivate();
	};

	/**
	 * Handles clicking the tab.
	 *
	 * @param {UIEvent} ev The event fired by the browser.
	 */
	KeywordTab.prototype.onClick = function( ev ) {
		ev.preventDefault();

		this.activate();
	};

	/**
	 * Returns the keyword for this keyword tab
	 */
	KeywordTab.prototype.getKeyword = function() {
		return this.element.find( '.wpseo_tablink' ).data( 'keyword' );
	};

	return KeywordTab;
})();

},{"lodash/defaults":169,"lodash/isUndefined":200}],5:[function(require,module,exports){
var defaultsDeep = require( 'lodash/defaultsDeep' );

var getIndicatorForScore = require( './getIndicatorForScore' );
var KeywordTab = require( './keywordTab' );

var $ = jQuery;

var defaultArguments = {
	strings: {
		keywordTab: '',
		contentTab: '',
		basedOn: ''
	},
	focusKeywordField: "#yoast_wpseo_focuskw"
};

/**
 * The tab manager is responsible for managing the analysis tabs in the metabox
 *
 * @constructor
 */
function TabManager( arguments ) {
	arguments = arguments || {};

	defaultsDeep( arguments, defaultArguments );

	this.arguments = arguments;
	this.strings = arguments.strings;
}

/**
 * Initializes the two tabs.
 */
TabManager.prototype.init = function() {
	var metaboxTabs = $( '#wpseo-metabox-tabs' );

	this.focusKeywordInput = $( '#yoast_wpseo_focuskw_text_input,#wpseo_focuskw' );
	this.focusKeywordRow = this.focusKeywordInput.closest( 'tr' );
	this.contentAnalysis = $( '#yoast-seo-content-analysis' );
	this.keywordAnalysis = $( '#wpseo-pageanalysis,#wpseo_analysis' );
	this.snippetPreview  = $( '#wpseosnippet' ).closest( 'tr' );

	var initialKeyword   = $( this.arguments.focusKeywordField ).val();

	// We start on the content analysis 'tab'.
	this.contentAnalysis.show();
	this.keywordAnalysis.hide();
	this.focusKeywordRow.hide();
	this.focusKeywordInput.val( '' );

	// Initialize an instance of the keyword tab.
	this.mainKeywordTab = new KeywordTab(
		{
			keyword: initialKeyword,
			prefix: this.strings.keywordTab,
			basedOn: this.strings.basedOn,
			fallback: this.strings.enterFocusKeyword,
			onActivate: function() {
				this.showKeywordAnalysis();
				this.deactivateContentTab();

				this.focusKeywordInput.val( this.mainKeywordTab.getKeyword() );

			}.bind( this ),
			afterActivate: function() {
				YoastSEO.app.refresh();
			}
		}
	);

	this.mainKeywordTab.init( metaboxTabs, 'prepend' );

	this.contentTab = new KeywordTab( {
		active: true,
		prefix: this.strings.contentTab,
		basedOn: '',
		showKeyword: false,
		isKeywordTab: false,
		onActivate: function() {
			this.showContentAnalysis();

			this.focusKeywordInput.val( '' );

			this.mainKeywordTab.active = false;
		}.bind( this ),
		afterActivate: function() {
			YoastSEO.app.refresh();
		}
	} );

	this.contentTab.init( metaboxTabs, 'prepend' );

	$( '.yoast-seo__remove-tab' ).remove();

	this.focusKeywordInput.val( '' );

	// Prevent us from saving an empty focus keyword when we are on the content tab.
	$( '#edittag' ).on( 'submit', function() {
		this.focusKeywordInput.val( this.mainKeywordTab.getKeyword() );
	}.bind( this ) );
};

/**
 * Shows the keyword analysis elements.
 */
TabManager.prototype.showKeywordAnalysis = function() {
	this.focusKeywordRow.show();
	this.keywordAnalysis.show();
	this.contentAnalysis.hide();
	this.snippetPreview.show();
};

/**
 * Shows the content analysis elements.
 */
TabManager.prototype.showContentAnalysis = function() {
	this.focusKeywordRow.hide();
	this.keywordAnalysis.hide();
	this.contentAnalysis.show();
	this.snippetPreview.hide();
};

/**
 * Deactivates the content tab (this will not re-render the tab.)
 */
TabManager.prototype.deactivateContentTab = function() {
	this.contentTab.active = false;
};

/**
 * Updates the content tab with the calculated score
 *
 * @param {number} score The score that has been calculated.
 */
TabManager.prototype.updateContentTab = function( score ) {
	var indicator = getIndicatorForScore( score );

	this.contentTab.update( indicator.className, indicator.screenReaderText );
};

/**
 * Updates the keyword tab with the calculated score
 *
 * @param {number} score The score that has been calculated.
 * @param {string} keyword The keyword that has been used to calculate the score.
 */
TabManager.prototype.updateKeywordTab = function( score, keyword ) {
	var indicator = {
		className: 'na',
		screenReaderText: YoastSEO.app.i18n.dgettext( 'js-text-analysis', 'Enter a focus keyword to calculate the SEO score' )
	};

	if ( this.mainKeywordTab.active ) {
		if ( keyword === '' ) {
			this.mainKeywordTab.update( indicator.className, indicator.screenReaderText );
		} else {
			indicator = getIndicatorForScore( score );
			this.mainKeywordTab.update( indicator.className, indicator.screenReaderText, keyword );
		}

		return;
	}

	// This branch makes sure that we see a color when loading the page.
	indicator = getIndicatorForScore( $( '#yoast_wpseo_linkdex, #hidden_wpseo_linkdex' ).val() );

	this.mainKeywordTab.update( indicator.className, indicator.screenReaderText );
};

/**
 * Returns whether or not the keyword is the main keyword
 *
 * @param {string} keyword The keyword to check
 *
 * @returns {boolean}
 */
TabManager.prototype.isMainKeyword = function( keyword ) {
	return this.mainKeywordTab.getKeyword() === keyword;
};

/**
 * Returns the keyword tab object
 *
 * @returns {KeywordTab} The keyword tab object.
 */
TabManager.prototype.getKeywordTab = function() {
	return this.mainKeywordTab;
};

/**
 * Returns the content tab object
 *
 * @returns {KeywordTab} The content tab object.
 */
TabManager.prototype.getContentTab = function() {
	return this.contentTab;
};

module.exports = TabManager;

},{"./getIndicatorForScore":2,"./keywordTab":4,"lodash/defaultsDeep":170}],6:[function(require,module,exports){
/* global jQuery, ajaxurl */

var UsedKeywordsPlugin = require( 'yoastseo' ).bundledPlugins.usedKeywords;
var _has = require( 'lodash/has' );
var _debounce = require( 'lodash/debounce' );
var _isArray = require( 'lodash/isArray' );
var $ = jQuery;

/**
 * Object that handles keeping track if the current keyword has been used before and retrieves this usage from the
 * server.
 *
 * @param {string} focusKeywordElement A jQuery selector for the focus keyword input element.
 * @param {string} ajaxAction The ajax action to use when retrieving the used keywords data.
 * @param {Object} options The options for the used keywords assessment plugin.
 * @param {Object} options.keyword_usage An object that contains the keyword usage when instantiating.
 * @param {Object} options.search_url The URL to link the user to if the keyword has been used multiple times.
 * @param {Object} options.post_edit_url The URL to link the user to if the keyword has been used a single time.
 * @param {App} app The app for which to keep track of the used keywords.
 */
function UsedKeywords( focusKeywordElement, ajaxAction, options, app ) {
	this._keywordUsage = options.keyword_usage;
	this._focusKeywordElement = $( focusKeywordElement );

	this._plugin = new UsedKeywordsPlugin( app, {
		usedKeywords: options.keyword_usage,
		searchUrl: options.search_url,
		postUrl: options.post_edit_url
	}, app.i18n );

},{"./config/config.js":31,"./contentAssessor.js":40,"./errors/missingArgument":42,"./pluggable.js":55,"./renderers/AssessorPresenter.js":56,"./researcher.js":57,"./seoAssessor.js":94,"./snippetPreview.js":95,"./values/Paper.js":136,"jed":137,"lodash/debounce":283,"lodash/defaultsDeep":285,"lodash/forEach":292,"lodash/isObject":309,"lodash/isString":312,"lodash/isUndefined":315}],3:[function(require,module,exports){
var filter = require( "lodash/filter" );
var isSentenceTooLong = require( "../helpers/isValueTooLong" );

/**
 * Initializes everything necessary for used keywords
 */
UsedKeywords.prototype.init = function() {
	var eventHandler = _debounce( this.keywordChangeHandler.bind( this ), 500 );

	this._plugin.registerPlugin();
	this._focusKeywordElement.on( 'keyup', eventHandler );
};

},{"../helpers/isValueTooLong":48,"lodash/filter":288}],4:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var inRange = require( "lodash/inRange" );

/**
 * Updates the keyword usage based on the response of the ajax request
 *
 * @param {string} keyword The keyword for which the usage was requested.
 * @param {*} response The response retrieved from the server.
 */
UsedKeywords.prototype.updateKeywordUsage = function( keyword, response ) {
	if ( response && _isArray( response ) ) {
		this._keywordUsage[ keyword ] = response;
		this._plugin.updateKeywordUsage( this._keywordUsage );
		this._app.analyzeTimer();
	}
};

module.exports = UsedKeywords;

},{"lodash/debounce":168,"lodash/has":179,"lodash/isArray":184,"yoastseo":226}],7:[function(require,module,exports){
var $ = jQuery;

var _forEach = require( 'lodash/foreach' );

var removeMarks = require( 'yoastseo/js/markers/removeMarks' );

var MARK_TAG = 'yoastmark';

/**
 * Puts a list of marks into the given tinyMCE editor
 *
 * @param {tinyMCE.Editor} editor The editor to apply the marks to.
 * @param {Paper} paper The paper for which the marks have been generated.
 * @param {Array.<Mark>} marks The marks to show in the editor.
 */
var fleschReadingEaseAssessment = function( paper, researcher, i18n ) {
	var fleschReadingScore = researcher.getResearch( "calculateFleschReading" );

	/* Translators: %1$s expands to the numeric flesch reading ease score, %2$s to a link to a Yoast.com article about Flesch ease reading score,
	 %3$s to the easyness of reading, %4$s expands to a note about the flesch reading score. */
	var text = i18n.dgettext( "js-text-analysis", "The copy scores %1$s in the %2$s test, which is considered %3$s to read. %4$s" );
	var url = "<a href='https://yoast.com/flesch-reading-ease-score/' target='new'>Flesch Reading Ease</a>";

	// scores must be between 0 and 100;
	if ( fleschReadingScore < 0 ) {
		fleschReadingScore = 0;
	}
	if ( fleschReadingScore > 100 ) {
		fleschReadingScore = 100;
	}

	var fleschReadingResult = calculateFleschReadingResult( fleschReadingScore, i18n );

	text = i18n.sprintf( text, fleschReadingScore, url, fleschReadingResult.resultText, fleschReadingResult.note );

	var assessmentResult =  new AssessmentResult();
	assessmentResult.setScore( fleschReadingResult.score );
	assessmentResult.setText( text );

	return assessmentResult;
};

	// Generate marked HTML.
	_forEach( marks, function( mark ) {
		html = mark.applyWithReplace( html );
	});

},{"../values/AssessmentResult.js":134,"lodash/inRange":296}],5:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var formatNumber = require( "../helpers/formatNumber.js" );
var getSubheadings = require( "../stringProcessing/getSubheadings.js" ).getSubheadings;
var Mark = require( "../values/Mark.js" );
var marker = require( "../markers/addMark.js" );
var inRange = require( "../helpers/inRange.js" ).inRangeEndInclusive;

	var markElements = dom.select( MARK_TAG );
	/*
	 * The `mce-bogus` data is an internal tinyMCE indicator that the elements themselves shouldn't be saved.
	 * Add data-mce-bogus after the elements have been inserted because setContent strips elements with data-mce-bogus.
	 */
	_forEach( markElements, function( markElement ) {
		markElement.setAttribute( 'data-mce-bogus', '1' );
	} );
}

/**
 * Returns a function that can decorate a tinyMCE editor
 *
 * @param {tinyMCE.Editor} editor The editor to return a function for.
 * @returns {Function} The function that can be called to decorate the editor.
 */
var subheadingsLengthScore = function( score, tooLongHeaders, recommendedValue, i18n ) {
	if ( score === 0 ) {
		return {};
	}

	if( score >= 7 ) {
		return {
			score: score,
			hasMarks: false,
			text: i18n.sprintf(
				i18n.dgettext(
					"js-text-analysis",
					// Translators: %1$d expands to the recommended maximum number of characters.
					"The length of all subheadings is less than or equal to the recommended maximum of %1$d characters, which is great."
				), recommendedValue
			)
		};
	}

	return {
		score: score,
		hasMarks: true,
		text: i18n.sprintf(
			i18n.dngettext(
				"js-text-analysis",
				// Translators: %1$d expands to the number of subheadings. %2$d expands to the recommended maximum number of characters.
				"You have %1$d subheading containing more than the recommended maximum of %2$d characters.",
				"You have %1$d subheadings containing more than the recommended maximum of %2$d characters.",
				tooLongHeaders
			), tooLongHeaders, recommendedValue
		)
	};
};

/**
 * Returns whether or not the editor has marks
 *
 * @param {tinyMCE.Editor} editor The editor.
 * @returns {boolean} Whether or not there are marks inside the editor.
 */
var getSubheadingLength = function( paper, researcher, i18n ) {
	var subheadingsLength = researcher.getResearch( "getSubheadingLength" );
	var recommendedValue = 50;
	var tooLong = 0;
	var scores = [];
	var lowestScore = 0;

	if ( subheadingsLength.length > 0 ) {
		forEach( subheadingsLength, function( length ) {
			if( length > recommendedValue ) {
				tooLong++;
			}

			if ( length <= 50 ) {
				// Green indicator.
				scores.push( 9 );
			}

			if ( inRange( length, 50, 60 ) ) {
				// Orange indicator.
				scores.push( 6 );
			}

			if ( length > 60 ) {
				// Red indicator.
				scores.push( 3 );
			}
		} );

		lowestScore = scores.sort(
			function( a, b ) {
				return a - b;
			}
		)[ 0 ];
	}

	// floatingPointFix because of js rounding errors
	lowestScore = formatNumber( lowestScore );

	var subheadingsLengthResult = subheadingsLengthScore( lowestScore, tooLong, recommendedValue, i18n );

	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( subheadingsLengthResult.score );
	assessmentResult.setText( subheadingsLengthResult.text );
	assessmentResult.setHasMarks( subheadingsLengthResult.hasMarks );

	return -1 !== content.indexOf( '<' + MARK_TAG );
}

/**
 * Removes marks currently in the given editor
 *
 * @param {tinyMCE.Editor} editor The editor to remove all marks for.
 */
function editorRemoveMarks( editor ) {
	// Create a decorator with the given editor.
	var decorator = tinyMCEDecorator( editor );

	// Calling the decorator with an empty array of marks will clear the editor of marks.
	decorator( null, [] );
}

module.exports = {
	tinyMCEDecorator: tinyMCEDecorator,

	editorHasMarks: editorHasMarks,
	editorRemoveMarks: editorRemoveMarks
};

},{"../helpers/formatNumber.js":45,"../helpers/inRange.js":47,"../markers/addMark.js":52,"../stringProcessing/getSubheadings.js":110,"../values/AssessmentResult.js":134,"../values/Mark.js":135,"lodash/filter":288,"lodash/forEach":292,"lodash/map":318}],6:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Updates the traffic light present on the page
 *
 * @param {Object} indicator The indicator for the keyword score.
 */
function updateAdminBar( indicator ) {
	$( '.adminbar-seo-score' )
		.attr( 'class', 'wpseo-score-icon adminbar-seo-score ' + indicator.className )
		.attr( 'alt', indicator.screenReaderText );
}

module.exports = {
	update: updateAdminBar
};

},{}],9:[function(require,module,exports){
var scoreDescriptionClass = 'score-text';
var imageScoreClass = 'image yoast-logo svg';

(function( $ ) {
	'use strict';
	/**
	 * Converts the first letter to uppercase in a string.
	 *
	 * @returns {string} The string with the first letter uppercased.
	 */
	String.prototype.ucfirst = function () {
		return this.charAt( 0 ).toUpperCase() + this.substr( 1 );
	};

	/**
	 * Creates a text with the label and description for a seo score.
	 *
	 * @param {String} scoreType The type of score, this is used for the label.
	 * @param {String} status The status for the score, this is the descriptive status text.
	 * @returns {String} A string with label and description with correct text decoration.
	 */
	function createSEOScoreLabel( scoreType, status ) {
		return scoreType.ucfirst() + ' score: ' + '<strong>' + status.ucfirst() + '</strong>';
	}

	/**
	 * Updates a score type in the publish box.
	 *
	 * @param {String} type The score type to update (content or seo).
	 * @param {String} status The status is the class name that is used to update the image.
	 */
	function updateScoreInPublishBox( type, status ) {
		var publishSection = $( '#' + type + '-score' );

		var imageClass = imageScoreClass + ' ' + status;
		publishSection.children( '.image' ).attr( 'class', imageClass );

		var text = createSEOScoreLabel( type, status );
		publishSection.children( '.' + scoreDescriptionClass ).html( text );
	}

},{"../values/AssessmentResult.js":134}],7:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

		var spanElem = $( '<span />', {
			'class': scoreDescriptionClass,
			'html': createSEOScoreLabel( type, status )
		} );

		var imgElem = $( '<span>' )
			.attr( 'class', imageScoreClass + ' na' );

		publishSection.append( imgElem ).append( spanElem );
		$( '#misc-publishing-actions' ).append( publishSection );
	}

	function initialise() {
		var notAvailableStatus = 'na';
		createScoresInPublishBox( 'content', notAvailableStatus );
		createScoresInPublishBox( 'keyword', notAvailableStatus );
	}

	module.exports = {
		initalise: initialise,
		updateScore: updateScoreInPublishBox
	};
}( jQuery ));

},{"../values/AssessmentResult.js":134}],8:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var matchWords = require( "../stringProcessing/matchTextWithWord.js" );
var countWords = require( "../stringProcessing/countWords.js" );
var formatNumber = require( "../helpers/formatNumber.js" );
var inRange = require( "lodash/inRange" );

/**
 * Updates the traffic light present on the page
 *
 * @param {Object} indicator The indicator for the keyword score.
 */
var calculateKeywordDensityResult = function( keywordDensity, i18n, keywordCount ) {
	var score, text, max;

	var keywordDensityPercentage = formatNumber( keywordDensity ) + "%";

	if ( keywordDensity > 3.5 ) {
		score = -50;

		/* Translators: %1$s expands to the keyword density percentage, %2$d expands to the keyword count,
		%3$s expands to the maximum keyword density percentage. */
		text = i18n.dgettext( "js-text-analysis", "The keyword density is %1$s," +
			" which is way over the advised %3$s maximum;" +
			" the focus keyword was found %2$d times." );

		/* Translators: This is the maximum keyword density, localize the number for your language (e.g. 2,5) */
		max = i18n.dgettext( "js-text-analysis", "2.5" ) + "%";

		text = i18n.sprintf( text, keywordDensityPercentage, keywordCount, max );
	}

	if ( inRange( keywordDensity, 2.5, 3.5 ) ) {
		score = -10;

		/* Translators: %1$s expands to the keyword density percentage, %2$d expands to the keyword count,
		%3$s expands to the maximum keyword density percentage. */
		text = i18n.dgettext( "js-text-analysis", "The keyword density is %1$s," +
			" which is over the advised %3$s maximum;" +
			" the focus keyword was found %2$d times." );

		/* Translators: This is the maximum keyword density, localize the number for your language (e.g. 2,5) */
		max = i18n.dgettext( "js-text-analysis", "2.5" ) + "%";

var getTitlePlaceholder = require( './analysis/getTitlePlaceholder' );
var getDescriptionPlaceholder = require( './analysis/getDescriptionPlaceholder' );
var getIndicatorForScore = require( './analysis/getIndicatorForScore' );
var TabManager = require( './analysis/tabManager' );

var removeMarks = require( 'yoastseo/js/markers/removeMarks' );
var tmceHelper = require( './wp-seo-tinymce' );

		/* Translators: %1$s expands to the keyword density percentage, %2$d expands to the keyword count. */
		text = i18n.dgettext( "js-text-analysis", "The keyword density is %1$s, which is great;" +
			" the focus keyword was found %2$d times." );

var updateTrafficLight = require( './ui/trafficLight' ).update;
var updateAdminBar = require( './ui/adminBar' ).update;

(function( $ ) {
	'use strict';

		/* Translators: %1$s expands to the keyword density percentage, %2$d expands to the keyword count. */
		text = i18n.dgettext( "js-text-analysis", "The keyword density is %1$s, which is a bit low;" +
			" the focus keyword was found %2$d times." );

	var App = require( 'yoastseo' ).App;

	var UsedKeywords = require( './analysis/usedKeywords' );

	var currentKeyword = '';

	var titleElement;

	var leavePostNameEmpty = false;

	var app, snippetPreview;

	var decorator = null;

	var tabManager;

},{"../helpers/formatNumber.js":45,"../stringProcessing/countWords.js":101,"../stringProcessing/matchTextWithWord.js":116,"../values/AssessmentResult.js":134,"lodash/inRange":296}],9:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

	/**
	 * Show warning in console when the unsupported CkEditor is used.
	 */
	var PostScraper = function() {
		if ( typeof CKEDITOR === 'object' ) {
			console.warn( 'YoastSEO currently doesn\'t support ckEditor. The content analysis currently only works with the HTML editor or TinyMCE.' );
		}
	};

	/**
	 * Get data from input fields and store them in an analyzerData object. This object will be used to fill
	 * the analyzer and the snippet preview.
	 */
	PostScraper.prototype.getData = function() {
		return {
			score: 0,
			text: i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$s opens a link to a Yoast article about stop words, %2$s closes the link */
				"Your focus keyword contains a stop word. This may or may not be wise depending on the circumstances. " +
				"Read %1$sthis article%2$s for more info.",
				"Your focus keyword contains %3$d stop words. This may or may not be wise depending on the circumstances. " +
				"Read %1$sthis article%2$s for more info.",
				stopWordCount
			)
		};
	};

	/**
	 * Gets the values from the given input. Returns this value.
	 * @param {String} inputType
	 * @returns {String}
	 */
	PostScraper.prototype.getDataFromInput = function( inputType ) {
		var newPostSlug, val = '';
		switch ( inputType ) {
			case 'text':
			case tmceId:
				val = removeMarks( tmceHelper.getContentTinyMce( tmceId ) );
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
					val = document.getElementById( 'excerpt' ) && document.getElementById( 'excerpt' ).value || '';
				}
				break;
			case 'primaryCategory':
				var categoryBase = $( '#category-all' ).find( 'ul.categorychecklist' );

				// If only one is visible than that item is the primary category.
				var checked = categoryBase.find( 'li input:checked' );
				if ( checked.length === 1 ) {
					val = this.getCategoryName( checked.parent() );
					break;
				}

				var primaryTerm = categoryBase.find( '.wpseo-primary-term > label' );
				if ( primaryTerm.length ) {
					val = this.getCategoryName( primaryTerm );
					break;
				}
				break;
			default:
				break;
		}
		return val;
	};

	/**
	 * Get the category name from the list item.
	 * @param {jQuery Object} li Item which contains the category
	 * @returns {String} Name of the category
     */
	PostScraper.prototype.getCategoryName = function( li ) {
		var clone = li.clone();
		clone.children().remove();
		return $.trim(clone.text());
	};

	/**
	 * When the snippet is updated, update the (hidden) fields on the page.
	 * @param {Object} value
	 * @param {String} type
	 */
	PostScraper.prototype.setDataFromSnippet = function( value, type ) {
		switch ( type ) {
			case 'snippet_meta':
				document.getElementById( 'yoast_wpseo_metadesc' ).value = value;
				break;
			case 'snippet_cite':

},{"../values/AssessmentResult.js":134}],10:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

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
	 * Calls the event binders.
	 */
	PostScraper.prototype.bindElementEvents = function( app ) {
		this.inputElementEventBinder( app );
		this.changeElementEventBinder( app );
	};

	/**
	 * Binds the reanalyze timer on change of dom element.
     */
	PostScraper.prototype.changeElementEventBinder = function( app ) {
		var elems = [ '#yoast-wpseo-primary-category', '.categorychecklist input[name="post_category[]"]' ];
		for( var i = 0; i < elems.length; i++ ) {
			$( elems[i] ).on('change', app.analyzeTimer.bind( app ) );
		}
	};

	/**
	 * Binds the renewData function on the change of input elements.
	 */
	PostScraper.prototype.inputElementEventBinder = function( app ) {
		var elems = [ 'excerpt', 'content', 'yoast_wpseo_focuskw_text_input', 'title' ];
		for ( var i = 0; i < elems.length; i++ ) {
			var elem = document.getElementById( elems[ i ] );
			if ( elem !== null ) {
				document.getElementById( elems[ i ] ).addEventListener( 'input', app.analyzeTimer.bind( app ) );
			}
		}

},{"../values/AssessmentResult.js":134}],11:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

		document.getElementById( 'yoast_wpseo_focuskw_text_input' ).addEventListener( 'blur', this.resetQueue );
	};

	/**
	 * Resets the current queue if focus keyword is changed and not empty.
	 */
	PostScraper.prototype.resetQueue = function() {
		if ( app.rawData.keyword !== '' ) {
			app.runAnalyzer( this.rawData );
		}
	};

	/**
	 * Saves the score to the linkdex.
	 * Outputs the score in the overall target.
	 *
	 * @param {string} score
	 */
	PostScraper.prototype.saveScores = function( score ) {
		var indicator = getIndicatorForScore( score );

		if ( tabManager.isMainKeyword( currentKeyword ) ) {
			document.getElementById( 'yoast_wpseo_linkdex' ).value = score;

			if ( '' === currentKeyword ) {
				indicator.className = 'na';
				indicator.screenReaderText = app.i18n.dgettext( 'js-text-analysis', 'Enter a focus keyword to calculate the SEO score' );
			}

},{"../values/AssessmentResult.js":134}],12:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var isParagraphTooLong = require( "../helpers/isValueTooLong" );
var Mark = require( "../values/Mark.js" );
var marker = require( "../markers/addMark.js" );
var inRange = require( "../helpers/inRange.js" ).inRangeEndInclusive;

			publishBox.updateScore( 'keyword', indicator.className );
		}

		// If multi keyword isn't available we need to update the first tab (content)
		if ( ! YoastSEO.multiKeyword ) {
			tabManager.updateKeywordTab( score, currentKeyword );
			publishBox.updateScore( 'content', indicator.className );

			// Updates the input with the currentKeyword value
			$( '#yoast_wpseo_focuskw' ).val( currentKeyword );
		}

/**
 * Returns the scores and text for the ParagraphTooLongAssessment
 * @param {array} paragraphsLength The array containing the lengths of individual paragraphs.
 * @param {number} tooLongParagraphs The number of too long paragraphs.
 * @param {object} i18n The i18n object used for translations.
 * @returns {{score: number, text: string }} the assessmentResult.
 */
var calculateParagraphLengthResult = function( paragraphsLength, tooLongParagraphs, i18n ) {
	var score;

	if ( paragraphsLength.length === 0 ) {
		return {};
	}

	var longestParagraphLength = paragraphsLength[ 0 ].wordCount;

	if ( longestParagraphLength <= 150 ) {
		// Green indicator.
		score = 9;
	}

	if ( inRange( longestParagraphLength, 150, 200 ) ) {
		// Orange indicator.
		score = 6;
	}

	if ( longestParagraphLength > 200 ) {
		// Red indicator.
		score = 3;
	}

	if ( score >= 7 ) {
		return {
			score: score,
			hasMarks: false,
			text: i18n.dgettext( "js-text-analysis", "None of your paragraphs are too long, which is great." )
		};
	}
	return {
		score: score,
		hasMarks: true,

		// Translators: %1$d expands to the number of paragraphs, %2$d expands to the recommended value
		text: i18n.sprintf( i18n.dngettext( "js-text-analysis", "%1$d of the paragraphs contains more than the recommended maximum " +
			"of %2$d words. Are you sure all information is about the same topic, and therefore belongs in one single paragraph?",
			"%1$d of the paragraphs contain more than the recommended maximum of %2$d words. Are you sure all information within each of" +
			" these paragraphs is about the same topic, and therefore belongs in a single paragraph?", tooLongParagraphs.length ),
			tooLongParagraphs.length, recommendedValue )
	};

	/**
	 * Initializes keyword tab with the correct template if multi keyword isn't available.
	 */
	PostScraper.prototype.initKeywordTabTemplate = function() {
		// If multi keyword is available we don't have to initialize this as multi keyword does this for us.
		if ( YoastSEO.multiKeyword ) {
			return;
		}

		// Remove default functionality to prevent scrolling to top.
		$( '.wpseo-metabox-tabs' ).on( 'click', '.wpseo_tablink', function( ev ) {
			ev.preventDefault();
		});
	};

	/**
	 * Returns whether or not the current post has a title.
	 *
	 * @returns {boolean}
	 */
	function postHasTitle() {
		return '' !== titleElement.val();
	}

	/**
	 * Retrieves either a generated slug or the page title as slug for the preview.
	 * @param {Object} response The AJAX response object.
	 * @returns {String}
	 */
	function getUrlPathFromResponse( response ) {
		if ( response.responseText === '' ) {
			return titleElement.val();
		}
		// Added divs to the response text, otherwise jQuery won't parse to HTML, but an array.
		return jQuery( '<div>' + response.responseText + '</div>' )
			.find( '#editable-post-name-full' )
			.text();
	}

	/**
	 * Binds to the WordPress jQuery function to put the permalink on the page.
	 * If the response matches with permalink string, the snippet can be rendered.
	 */
	jQuery( document ).on( 'ajaxComplete', function( ev, response, ajaxOptions ) {
		var ajax_end_point = '/admin-ajax.php';
		if ( ajax_end_point !== ajaxOptions.url.substr( 0 - ajax_end_point.length ) ) {
			return;
		}

		if ( 'string' === typeof ajaxOptions.data && -1 !== ajaxOptions.data.indexOf( 'action=sample-permalink' ) ) {
			/*
			 * If the post has no title, WordPress wants to auto generate the slug once the title is set, so we need to
			 * keep the post name empty.
			 */
			if ( ! postHasTitle() ) {
				leavePostNameEmpty = true;
			}
			app.snippetPreview.setUrlPath( getUrlPathFromResponse( response ) );
		}
	} );

	/**
	 * Initializes the snippet preview.
	 *
	 * @param {PostScraper} postScraper
	 * @returns {YoastSEO.SnippetPreview}
	 */
	function initSnippetPreview( postScraper ) {
		var data = postScraper.getData();

},{"../helpers/inRange.js":47,"../helpers/isValueTooLong":48,"../markers/addMark.js":52,"../values/AssessmentResult.js":134,"../values/Mark.js":135,"lodash/filter":288,"lodash/map":318}],13:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var formatNumber = require( "../helpers/formatNumber.js" );
var inRange = require( "../helpers/inRange.js" ).inRangeEndInclusive;

var Mark = require( "../values/Mark.js" );
var marker = require( "../markers/addMark.js" );

var map = require( "lodash/map" );

/**
 * Calculates the result based on the number of sentences and passives.
 * @param {object} passiveVoice The object containing the number of sentences and passives
 * @param {object} i18n The object used for translations.
 * @returns {{score: number, text}} resultobject with score and text.
 */
var calculatePassiveVoiceResult = function( passiveVoice, i18n ) {
	var score;

	var percentage = ( passiveVoice.passives.length / passiveVoice.total ) * 100;
	percentage = formatNumber( percentage );
	var recommendedValue = 10;
	var passiveVoiceURL = "<a href='https://yoa.st/passive-voice' target='_blank'>";
	var hasMarks = ( percentage > 0 );

	if ( percentage <= 10 ) {
		// Green indicator.
		score = 9;
	}

	if ( inRange( percentage, 10, 15 ) ) {
		// Orange indicator.
		score = 6;
	}

	if ( percentage > 15 ) {
		// Red indicator.
		score = 3;
	}

	if ( score >= 7 ) {
		return {
			score: score,
			hasMarks: hasMarks,
			text: i18n.sprintf(
					i18n.dgettext(
						"js-text-analysis",

						// Translators: %1$s expands to the number of sentences in passive voice, %2$s expands to a link on yoast.com,
						// %3$s expands to the anchor end tag, %4$s expands to the recommended value.
						"%1$s of the sentences contain a %2$spassive voice%3$s, " +
						"which is less than or equal to the recommended maximum of %4$s." ),
					percentage + "%",
					passiveVoiceURL,
					"</a>",
					recommendedValue + "%"
			)
		};
	}

				// Translators: %1$s expands to the number of sentences in passive voice, %2$s expands to a link on yoast.com,
				// %3$s expands to the anchor end tag, %4$s expands to the recommended value.
				"%1$s of the sentences contain a %2$spassive voice%3$s, " +
				"which is more than the recommended maximum of %4$s. Try to use their active counterparts."
			),
			percentage + "%",
			passiveVoiceURL,
			"</a>",
			recommendedValue + "%"
		)
	};
};

		var savedKeywordScore = $( '#yoast_wpseo_linkdex' ).val();

		publishBox.initalise();

		tabManager = new TabManager({
			strings: wpseoPostScraperL10n
		});
		tabManager.init();

		postScraper = new PostScraper();

		args = {
			// ID's of elements that need to trigger updating the analyzer.
			elementTarget: [tmceId, 'yoast_wpseo_focuskw_text_input', 'yoast_wpseo_metadesc', 'excerpt', 'editable-post-name', 'editable-post-name-full'],
			targets: {
				output: 'wpseo-pageanalysis',
				contentOutput: 'yoast-seo-content-analysis'
			},
			callbacks: {
				getData: postScraper.getData.bind( postScraper ),
				bindElementEvents: postScraper.bindElementEvents.bind( postScraper ),
				saveScores: postScraper.saveScores.bind( postScraper ),
				saveContentScore: postScraper.saveContentScore.bind( postScraper ),
				saveSnippetData: postScraper.saveSnippetData.bind( postScraper )
			},
			locale: wpseoPostScraperL10n.locale,
			marker: function( paper, marks ) {
				if ( tmceHelper.isTinyMCEAvailable( tmceId ) ) {
					if ( null === decorator ) {
						decorator = tinyMCEDecorator( tinyMCE.get( tmceId ) );
					}

					decorator( paper, marks );
				}
			}
		};

		titleElement = $( '#title' );

},{"../helpers/formatNumber.js":45,"../helpers/inRange.js":47,"../markers/addMark.js":52,"../values/AssessmentResult.js":134,"../values/Mark.js":135,"lodash/map":318}],14:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var countTooLongSentences = require( "./../assessmentHelpers/checkForTooLongSentences.js" );
var formatNumber = require( "../helpers/formatNumber.js" );
var inRange = require( "../helpers/inRange.js" ).inRangeEndInclusive;

		if ( typeof translations !== 'undefined' && typeof translations.domain !== 'undefined' ) {
			translations.domain = 'js-text-analysis';
			translations.locale_data['js-text-analysis'] = translations.locale_data['wordpress-seo'];

var map = require( "lodash/map" );

		snippetPreview = initSnippetPreview( postScraper );
		args.snippetPreview = snippetPreview;

		app = new App( args );
		window.YoastSEO = {};
		window.YoastSEO.app = app;

		// Init Plugins
		YoastSEO.wp = {};
		YoastSEO.wp.replaceVarsPlugin = new YoastReplaceVarPlugin( app );
		YoastSEO.wp.shortcodePlugin = new YoastShortcodePlugin( app );

/**
 * Calculates sentence length score.
 *
 * @param {Object} sentences The object containing sentences and its length.
 * @param {Object} i18n The object used for translations.
 * @returns {Object} Object containing score and text.
 */
var calculateSentenceLengthResult = function( sentences, i18n ) {
	var score;
	var percentage = 0;
	var tooLongTotal = tooLongSentencesTotal( sentences, recommendedValue );

	if ( sentences.length !== 0 ) {
		percentage = formatNumber( ( tooLongTotal / sentences.length ) * 100 );
	}

	if ( percentage <= 25 ) {
		// Red indicator.
		score = 9;
	}

	if ( inRange( percentage, 25, 30 ) ) {
		// Orange indicator.
		score = 6;
	}

	if ( percentage > 30 ) {
		// Red indicator.
		score = 3;
	}

	var hasMarks = ( percentage > 0 );
	var sentenceLengthURL = "<a href='https://yoa.st/short-sentences' target='_blank'>";

	if ( score >= 7 ) {
		return {
			score: score,
			hasMarks: hasMarks,
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis",
				// Translators: %1$d expands to percentage of sentences, %2$s expands to a link on yoast.com,
				// %3$s expands to the recommended maximum sentence length, %4$s expands to the anchor end tag,
				// %5$s expands to the recommended maximum percentage.
				"%1$s of the sentences contain %2$smore than %3$s words%4$s, which is less than or equal to the recommended maximum of %5$s."
				), percentage + "%", sentenceLengthURL, recommendedValue, "</a>", maximumPercentage + "%"
			)
		};
	}

		var indicator = getIndicatorForScore( savedKeywordScore );
		updateTrafficLight( indicator );
		updateAdminBar( indicator );
		publishBox.updateScore( 'keyword', indicator.className );

		// Translators: %1$s expands to the percentage of sentences, %2$d expands to the maximum percentage of sentences.
		// %3$s expands to the recommended amount of words.
		text: i18n.sprintf( i18n.dgettext( "js-text-analysis",

			// Translators: %1$d expands to percentage of sentences, %2$s expands to a link on yoast.com,
			// %3$s expands to the recommended maximum sentence length, %4$s expands to the anchor end tag,
			// %5$s expands to the recommended maximum percentage.
			"%1$s of the sentences contain %2$smore than %3$s words%4$s, which is more than the recommended maximum of %5$s." +
			"Try to shorten your sentences."
			), percentage + "%", sentenceLengthURL, recommendedValue, "</a>", maximumPercentage + "%"
		)
	};
};

		jQuery( window ).trigger( 'YoastSEO:ready' );

		// Backwards compatibility.
		YoastSEO.analyzerArgs = args;

		if ( ! YoastSEO.multiKeyword ) {
			/*
			 * Hitting the enter on the focus keyword input field will trigger a form submit. Because of delay in
			 * copying focus keyword to the hidden field, the focus keyword won't be saved properly. By adding a
			 * onsubmit event that is copying the focus keyword, this should be solved.
			 */
			$( '#post' ).on( 'submit', function() {
				var hiddenKeyword       = $( '#yoast_wpseo_focuskw' );
				var hiddenKeywordValue  = hiddenKeyword.val();
				var visibleKeywordValue = tabManager.getKeywordTab().getKeyword();

				if ( hiddenKeywordValue !== visibleKeywordValue ) {
					hiddenKeyword.val( visibleKeywordValue );
				}
			} );
		}
	} );
};

module.exports = {
	identifier: "textSentenceLength",
	getResult: sentenceLengthInTextAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	},
	getMarks: sentenceLengthMarker
};

},{"../helpers/formatNumber.js":45,"../helpers/inRange.js":47,"../markers/addMark.js":52,"../values/AssessmentResult.js":134,"../values/Mark.js":135,"./../assessmentHelpers/checkForTooLongSentences.js":3,"lodash/map":318}],15:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var isTextTooLong = require( "../helpers/isValueTooLong" );
var filter = require( "lodash/filter" );
var map = require( "lodash/map" );

var Mark = require( "../values/Mark.js" );
var marker = require( "../markers/addMark.js" );
var inRange = require( "../helpers/inRange.js" ).inRangeEndInclusive;

var forEach = require( 'lodash/forEach' );
var editorHasMarks = require( './decorator/tinyMCE' ).editorHasMarks;
var editorRemoveMarks = require( './decorator/tinyMCE' ).editorRemoveMarks;

(function() {
	'use strict';

/**
 * Calculates the score based on the subheading texts length.
 * @param {Array} subheadingTextsLength Array with subheading text lengths.
 * @param {number} tooLongTexts The number of subheading texts that are too long.
 * @param {object} i18n The object used for translations.
 * @returns {object} the resultobject containing a score and text if subheadings are present
 */
var subheadingsTextLength = function( subheadingTextsLength, tooLongTexts, i18n ) {
	var score;

	/**
	 * Returns whether or not the tinyMCE script is available on the page.
	 *
	 * @returns {boolean}
	 */
	function isTinyMCELoaded() {
		return (
			typeof tinyMCE !== 'undefined' &&
			typeof tinyMCE.editors !== 'undefined' &&
			tinyMCE.editors.length !== 0
		);
	}

	var longestSubheadingTextLength = subheadingTextsLength[ 0 ].wordCount;

	if ( longestSubheadingTextLength <= 300 ) {
		// Green indicator.
		score = 9;
	}

	if ( inRange( longestSubheadingTextLength, 300, 350  ) ) {
		// Orange indicator.
		score = 6;
	}

	if ( longestSubheadingTextLength > 350 ) {
		// Red indicator.
		score = 3;
	}

	if ( score >= 7 ) {
		return {
			score: score,
			text: i18n.sprintf(
				i18n.dgettext(
					"js-text-analysis",
					"The amount of words following each of your subheadings doesn't exceed the recommended maximum of %1$d words, which is great."
				), recommendedValue )
		};
	}

	return {
		score: score,
		hasMarks: true,

		// Translators: %1$d expands to the number of subheadings, %2$d expands to the recommended value
		text: i18n.sprintf(
			i18n.dngettext(
				"js-text-analysis",
				"%1$d of the subheadings is followed by more than the recommended maximum of %2$d words. Try to insert another subheading.",
				"%1$d of the subheadings are followed by more than the recommended maximum of %2$d words. Try to insert additional subheadings.",
				tooLongTexts ),
			tooLongTexts, recommendedValue
		)
	};
};

	/**
	 * Converts the html entities for symbols back to the original symbol. For now this only converts the & symbol.
	 * @param {String} text The text to replace the '&amp;' entities.
	 * @returns {String} text Text with html entities replaced by the symbol.
	 */
	function convertHtmlEntities( text ) {
		// Create regular expression, this searches for the html entity '&amp;', the 'g' param is for searching the whole text.
		var regularExpression = new RegExp('&amp;','g');
		return text.replace(regularExpression, '&');
	}

	/**
	 * Returns the value of the content field via TinyMCE object, or ff tinyMCE isn't initialized via the content element id.
	 * Also converts 'amp;' to & in the content.
	 * @param {String} content_id The (HTML) id attribute for the TinyMCE field.
	 * @returns {String} Content from the TinyMCE editor.
	 */
	function getContentTinyMce( content_id ) {
		//if no TinyMce object available
		var content = '';
		if ( isTinyMCEAvailable( content_id ) === false ) {
			content = tinyMCEElementContent( content_id );
		}
		else {
			content = tinyMCE.get( content_id ).getContent();
		}

		return convertHtmlEntities( content );
	}
	/**
	 * Adds an event handler to certain tinyMCE events
	 *
	 * @param {string} editorId The ID for the tinyMCE editor.
	 * @param {Array<string>} events The events to bind to.
	 * @param {Function} callback The function to call when an event occurs.
	 */
	function addEventHandler( editorId, events, callback ) {
		if ( typeof tinyMCE === 'undefined' || typeof tinyMCE.on !== 'function' ) {
			return;
		}

		tinyMCE.on( 'addEditor', function( evt ) {
			var editor = evt.editor;

			if ( editor.id !== editorId ) {
				return;
			}

			forEach( events, function( eventName ) {
				editor.on( eventName, callback );
			} );
		});
	}

	/**
	 * Binds the renewData functionality to the TinyMCE content field on the change of input elements.
	 *
	 * @param {App} app YoastSeo application.
	 * @param {String} tmceId The ID of the tinyMCE editor.
	 */
	function tinyMceEventBinder( app, tmceId ) {
		addEventHandler( tmceId, [ 'input', 'change', 'cut', 'paste' ], app.refresh.bind( app ) );

},{"../helpers/inRange.js":47,"../helpers/isValueTooLong":48,"../markers/addMark.js":52,"../values/AssessmentResult.js":134,"../values/Mark.js":135,"lodash/filter":288,"lodash/map":318}],16:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

			if ( editorHasMarks( editor ) ) {
				editorRemoveMarks( editor );

			// Translators: %1$d expands to the number of subheadings
			text: i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",
					"The text contains %1$d subheading, which is great.",
					"The text contains %1$d subheadings, which is great.",
					subheadingPresence
				), subheadingPresence
			)
		};
	}

	/**
	 * Deactivates the active result marks.
	 */
	function deactivateResultMarks() {
		jQuery( '.assessment-results__mark' ).addClass( 'icon-eye-inactive' ).removeClass( 'icon-eye-active' );
	}

/**
 * Runs the getSubheadingLength research and checks scores based on length.
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessmentresult
 */
var getSubheadingPresence = function( paper, researcher, i18n ) {
	var subheadingPresence = researcher.getResearch( "getSubheadingPresence" );
	var result = calculateSubheadingPresenceResult( subheadingPresence, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( result.score );
	assessmentResult.setText( result.text );

	return assessmentResult;
};

module.exports = {
	identifier: "subheadingPresence",
	getResult: getSubheadingPresence,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};

},{"../values/AssessmentResult.js":134}],17:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

},{"./decorator/tinyMCE":7,"lodash/forEach":176}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
/**
 * @preserve jed.js https://github.com/SlexAxton/Jed
 */
/*
-----------
A gettext compatible i18n library for modern JavaScript Applications

by Alex Sexton - AlexSexton [at] gmail - @SlexAxton
WTFPL license for use
Dojo CLA for contributions

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

},{"../values/AssessmentResult.js":134}],18:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

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

},{"../markers/addMark.js":52,"../values/AssessmentResult.js":134,"../values/Mark.js":135,"lodash/map":318}],19:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var isEmpty = require( "lodash/isEmpty" );

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

},{"../values/AssessmentResult.js":134,"lodash/isEmpty":304}],20:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var inRange = require( "lodash/inRange" );

/**
 * Calculate the score based on the current word count.
 * @param {number} wordCount The amount of words to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var calculateWordCountResult = function( wordCount, i18n ) {
	if ( wordCount > 300 ) {
		return {
			score: 9,
			text: i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$d expands to the number of words in the text, %2$s to the recommended minimum of words */
				"The text contains %1$d word, which is more than the recommended minimum of %2$d word.",
				"The text contains %1$d words, which is more than the recommended minimum of %2$d words.",
				wordCount
			)
		};
	}

	if ( inRange( wordCount, 250, 300 ) ) {
		return {
			score: 7,
			text: i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$d expands to the number of words in the text, %2$s to the recommended minimum of words */
				"The text contains %1$d word, which is slightly below the recommended minimum of %2$d word. Add a bit more copy.",
				"The text contains %1$d words, which is slightly below the recommended minimum of %2$d words. Add a bit more copy.",
				wordCount
			)
		};
	}

	if ( inRange( wordCount, 200, 250 ) ) {
		return {
			score: 5,
			text: i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$d expands to the number of words in the text, %2$d to the recommended minimum of words */
				"The text contains %1$d word, which is below the recommended minimum of %2$d word. " +
				"Add more useful content on this topic for readers.",
				"The text contains %1$d words, which is below the recommended minimum of %2$d words. " +
				"Add more useful content on this topic for readers.",
				wordCount
			)
		};
	}

	if ( inRange( wordCount, 100, 200 ) ) {
		return {
			score: -10,
			text: i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$d expands to the number of words in the text, %2$d to the recommended minimum of words */
				"The text contains %1$d word, which is below the recommended minimum of %2$d word. " +
				"Add more useful content on this topic for readers.",
				"The text contains %1$d words, which is below the recommended minimum of %2$d words. " +
				"Add more useful content on this topic for readers.",
				wordCount
			)
		};
	}

	if ( inRange( wordCount, 0, 100 ) ) {
		return {
			score: -20,
			text: i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$d expands to the number of words in the text */
				"The text contains %1$d word, which is far too low. Increase the word count.",
				"The text contains %1$d words, which is far too low. Increase the word count.",
				wordCount
			)
		};
	}
};

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

},{"../values/AssessmentResult.js":134,"lodash/inRange":296}],21:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var isEmpty = require( "lodash/isEmpty" );

          if ( isNaN( val ) ) {
            throw new Error('The number that was passed in is not a number.');
          }
        }

	if ( linkStatistics.externalNofollow === linkStatistics.total ) {
		return {
			score: 7,
			/* Translators: %1$s expands the number of outbound links */
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "This page has %1$s outbound link(s), all nofollowed." ),
				linkStatistics.externalNofollow )
		};
	}

	if ( linkStatistics.externalNofollow < linkStatistics.total ) {
		return {
			score: 8,
			/* Translators: %1$s expands to the number of nofollow links, %2$s to the number of outbound links */
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "This page has %1$s nofollowed link(s) and %2$s normal outbound link(s)." ),
				linkStatistics.externalNofollow, linkStatistics.externalDofollow )
		};
	}

	if ( linkStatistics.externalDofollow === linkStatistics.total ) {
		return {
			score: 9,
			/* Translators: %1$s expands to the number of outbound links */
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "This page has %1$s outbound link(s)." ), linkStatistics.externalTotal )
		};
	}
};

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

},{"../values/AssessmentResult.js":134,"lodash/isEmpty":304}],22:[function(require,module,exports){
var stripHTMLTags = require( "../stringProcessing/stripHTMLTags" );
var AssessmentResult = require( "../values/AssessmentResult" );

/**
 * Assesses that the paper has at least a little bit of content.
 *
 * @param {Paper} paper The paper to assess.
 * @param {Researcher} researcher The researcher.
 * @param {Jed} i18n The translations object.
 * @returns {AssessmentResult} The result of this assessment.
 */
function textPresenceAssessment( paper, researcher, i18n ) {
	var text = stripHTMLTags( paper.getText() );

	if ( text.length < 50 ) {
		var result = new AssessmentResult();

		result.setText( i18n.dgettext( "js-text-analysis", "You have far too little content, please add some content to enable a good analysis." ) );
		result.setScore( 3 );

		return result;
	}

	return new AssessmentResult();
}

module.exports = {
	identifier: "textPresence",
	getResult: textPresenceAssessment
};

},{"../stringProcessing/stripHTMLTags":126,"../values/AssessmentResult":134}],23:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

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

},{"../values/AssessmentResult.js":134}],24:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var inRange = require( "lodash/inRange" );

    var str_format = function() {
      if (!str_format.cache.hasOwnProperty(arguments[0])) {
        str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
      }
      return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
    };

	if ( inRange( pageTitleLength, 1, 35 ) ) {
		return {
			score: 6,
			text: i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",
					/* Translators: %1$d expands to the number of characters in the page title,
					%2$d to the minimum number of characters for the title */
					"The page title contains %1$d character, which is less than the recommended minimum of %2$d characters. " +
					"Use the space to add keyword variations or create compelling call-to-action copy.",
					"The page title contains %1$d characters, which is less than the recommended minimum of %2$d characters. " +
					"Use the space to add keyword variations or create compelling call-to-action copy.",
				pageTitleLength ),
				pageTitleLength, minLength )
		};
	}

	if ( inRange( pageTitleLength, 35, 66 ) ) {
		return {
			score: 9,
			text: i18n.sprintf(
				i18n.dgettext(
					"js-text-analysis",
					/* Translators: %1$d expands to the minimum number of characters in the page title, %2$d to the maximum number of characters */
					"The page title is between the %1$d character minimum and the recommended %2$d character maximum." ),
				minLength, maxLength )
		};
	}

	if ( pageTitleLength > maxLength ) {
		return {
			score: 6,
			text: i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",
					/* Translators: %1$d expands to the number of characters in the page title, %2$d to the maximum number
					of characters for the title */
					"The page title contains %1$d character, which is more than the viewable limit of %2$d characters; " +
					"some words will not be visible to users in your listing.",
					"The page title contains %1$d characters, which is more than the viewable limit of %2$d characters; " +
					"some words will not be visible to users in your listing.",
					pageTitleLength ),
				pageTitleLength, maxLength )
		};
	}

	return {
		score: 1,
		text: i18n.dgettext( "js-text-analysis", "Please create a page title." )
	};
};

/**
 * Runs the pageTitleLength module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var titleLengthAssessment = function( paper, researcher, i18n ) {
	var pageTitleLength = researcher.getResearch( "pageTitleLength" );
	var pageTitleLengthResult = calculatePageTitleLengthResult( pageTitleLength, i18n );
	var assessmentResult = new AssessmentResult();

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

},{"../values/AssessmentResult.js":134,"lodash/inRange":296}],25:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var formatNumber = require( "../helpers/formatNumber.js" );
var map = require( "lodash/map" );
var inRange = require( "../helpers/inRange.js" ).inRangeStartInclusive;

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

/**
 * Calculates transition word result
 * @param {object} transitionWordSentences The object containing the total number of sentences and the number of sentences containing
 * a transition word.
 * @param {object} i18n The object used for translations.
 * @returns {object} Object containing score and text.
 */
var calculateTransitionWordResult = function( transitionWordSentences, i18n ) {
	var score;
	var percentage = ( transitionWordSentences.transitionWordSentences / transitionWordSentences.totalSentences ) * 100;
	percentage     = formatNumber( percentage );
	var hasMarks   = ( percentage > 0 );
	var transitionWordsURL = "<a href='https://yoa.st/transition-words' target='_blank'>";

	if ( percentage < 35 ) {
		// Red indicator.
		score = 3;
	}

	if ( inRange( percentage, 35, 45 ) ) {
		// Orange indicator.
		score = 6;
	}

	if ( percentage >= 45 ) {
		// Green indicator.
		score = 9;
	}

	if ( score < 7 ) {
		var recommendedMinimum = 45;
		return {
			score: formatNumber( score ),
			hasMarks: hasMarks,
			text: i18n.sprintf(
				i18n.dgettext( "js-text-analysis",

					// Translators: %1$s expands to the number of sentences containing transition words, %2$s expands to a link on yoast.com,
					// %3$s expands to the anchor end tag, %4$s expands to the recommended value.
					"%1$s of the sentences contain a %2$stransition word%3$s or phrase, " +
					"which is less than the recommended minimum of %4$s."
				), percentage + "%", transitionWordsURL, "</a>", recommendedMinimum + "%" )
		};
	}

  Jed.prototype.sprintf = function () {
    return Jed.sprintf.apply(this, arguments);
  };
  // END sprintf Implementation

			// Translators: %1$s expands to the number of sentences containing transition words, %2$s expands to a link on yoast.com,
			// %3$s expands to the anchor end tag.
			"%1$s of the sentences contain a %2$stransition word%3$s or phrase, " +
			"which is great."
		), percentage + "%", transitionWordsURL, "</a>" )
	};
};

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

},{"../helpers/formatNumber.js":45,"../helpers/inRange.js":47,"../markers/addMark.js":52,"../values/AssessmentResult.js":134,"../values/Mark.js":135,"lodash/map":318}],26:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

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

},{"../values/AssessmentResult.js":134}],27:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

    if (typeof this.yy.parseError === 'function')
        this.parseError = this.yy.parseError;

    function popStack (n) {
        stack.length = stack.length - 2*n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

},{"../values/AssessmentResult.js":134}],28:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

    var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length-1];

	if ( stopWordCount > 0 ) {
		return {
			score: 5,
			text: i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$s opens a link to a wikipedia article about stop words, %2$s closes the link */
				"The slug for this page contains a %1$sstop word%2$s, consider removing it.",
				"The slug for this page contains %1$sstop words%2$s, consider removing them.",
				stopWordCount
			)
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
var urlHasStopWordsAssessment = function( paper, researcher, i18n ) {
	var stopWords = researcher.getResearch( "stopWordsInUrl" );
	var stopWordsResult = calculateUrlStopWordsCountResult( stopWords.length, i18n );

	var assessmentResult = new AssessmentResult();
	assessmentResult.setScore( stopWordsResult.score );
	assessmentResult.setText( i18n.sprintf(
		stopWordsResult.text,
		/* Translators: this link is referred to in the content analysis when a slug contains one or more stop words */
		"<a href='" + i18n.dgettext( "js-text-analysis", "http://en.wikipedia.org/wiki/Stop_words" ) + "' target='new'>",
		"</a>"
	) );

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

},{"../values/AssessmentResult.js":134}],29:[function(require,module,exports){
var Researcher = require( "./researcher.js" );
var MissingArgument = require( "./errors/missingArgument" );
var removeDuplicateMarks = require( "./markers/removeDuplicateMarks" );
var AssessmentResult = require( "./values/AssessmentResult.js" );
var showTrace = require( "./helpers/errors.js" ).showTrace;

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
      define('jed', function() {
        return Jed;
      });
    }
    // Leak a global regardless of module system
    root['Jed'] = Jed;
  }

})(this);

},{}],15:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":113,"./_root":154}],16:[function(require,module,exports){
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
      length = entries ? entries.length : 0;

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

		result = new AssessmentResult();

		result.setScore( 0 );
		result.setText( this.i18n.sprintf(
			/* Translators: %1$s expands to the name of the assessment. */
			this.i18n.dgettext( "js-text-analysis", "An error occured in the '%1$s' assessment" ),
			assessment.identifier,
			assessmentError
		) );
	}
	return result;
};

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

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

},{"./_listCacheClear":140,"./_listCacheDelete":141,"./_listCacheGet":142,"./_listCacheHas":143,"./_listCacheSet":144}],18:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":113,"./_root":154}],19:[function(require,module,exports){
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
      length = entries ? entries.length : 0;

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

},{"./_mapCacheClear":145,"./_mapCacheDelete":146,"./_mapCacheGet":147,"./_mapCacheHas":148,"./_mapCacheSet":149}],20:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":113,"./_root":154}],21:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Reflect = root.Reflect;

module.exports = Reflect;

},{"./_root":154}],22:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":113,"./_root":154}],23:[function(require,module,exports){
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
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

},{"./errors/missingArgument":42,"./helpers/errors.js":44,"./markers/removeDuplicateMarks":53,"./researcher.js":57,"./values/AssessmentResult.js":134,"lodash/filter":288,"lodash/find":289,"lodash/findIndex":290,"lodash/forEach":292,"lodash/isFunction":305,"lodash/isUndefined":315,"lodash/map":318}],30:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var isUndefined = require( "lodash/isUndefined" );

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;

},{"./_ListCache":17,"./_stackClear":158,"./_stackDelete":159,"./_stackGet":160,"./_stackHas":161,"./_stackSet":162}],25:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":154}],26:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":154}],27:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":113,"./_root":154}],28:[function(require,module,exports){
/**
 * Adds the key-value `pair` to `map`.
 *
 * @param {object} previouslyUsedKeywords The result of the previously used keywords research
 * @param {Paper} paper The paper object to research.
 * @param {Jed} i18n The i18n object.
 * @returns {object} the scoreobject with text and score.
 */
PreviouslyUsedKeyword.prototype.scoreAssessment = function( previouslyUsedKeywords, paper, i18n ) {
	var count = previouslyUsedKeywords.count;
	var id = previouslyUsedKeywords.id;
	if( count === 0 ) {
		return {
			text: i18n.dgettext( "js-text-analysis", "You've never used this focus keyword before, very good." ),
			score: 9
		};
	}
	if( count === 1 ) {
		var url = "<a href='" + this.postUrl.replace( "{id}", id ) + "' target='_blank'>";
		return {
			/* Translators: %1$s and %2$s expand to an admin link where the focus keyword is already used */
			text:  i18n.sprintf( i18n.dgettext( "js-text-analysis", "You've used this focus keyword %1$sonce before%2$s, " +
				"be sure to make very clear which URL on your site is the most important for this keyword." ), url, "</a>" ),
			score: 6
		};
	}
	if ( count > 1 ) {
		url = "<a href='" + this.searchUrl.replace( "{keyword}", paper.getKeyword() )+ "' target='_blank'>";
		return {
			/* Translators: %1$s and $3$s expand to the admin search page for the focus keyword, %2$d expands to the number of times this focus
			 keyword has been used before, %4$s and %5$s expand to a link to an article on yoast.com about cornerstone content */
			text:  i18n.sprintf( i18n.dgettext( "js-text-analysis", "You've used this focus keyword %1$s%2$d times before%3$s, " +
				"it's probably a good idea to read %4$sthis post on cornerstone content%5$s and improve your keyword strategy." ),
				url, count, "</a>", "<a href='https://yoast.com/cornerstone-content-rank/' target='_blank'>", "</a>" ),
			score: 1
		};
	}
};

},{}],29:[function(require,module,exports){
/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  set.add(value);
  return set;
}

module.exports = addSetEntry;

},{}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
/**
 * A specialized version of `baseAggregator` for arrays.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform keys.
 * @param {Object} accumulator The initial aggregated object.
 * @returns {Function} Returns `accumulator`.
 */
function arrayAggregator(array, setter, iteratee, accumulator) {
  var index = -1,
      length = array ? array.length : 0;

},{"../../js/errors/missingArgument":42,"../values/AssessmentResult.js":134,"lodash/isUndefined":315}],31:[function(require,module,exports){
var analyzerConfig = {
	queue: [ "wordCount", "keywordDensity", "subHeadings", "stopwords", "fleschReading", "linkCount", "imageCount", "urlKeyword", "urlLength", "metaDescriptionLength", "metaDescriptionKeyword", "pageTitleKeyword", "pageTitleLength", "firstParagraph", "urlStopwords", "keywordDoubles", "keyphraseSizeCheck" ],
	stopWords: [ "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from", "further", "had", "has", "have", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "it", "it's", "its", "itself", "let's", "me", "more", "most", "my", "myself", "nor", "of", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "she'd", "she'll", "she's", "should", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "we'd", "we'll", "we're", "we've", "were", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "would", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves" ],
	wordsToRemove: [ " a", " in", " an", " on", " for", " the", " and" ],
	maxSlugLength: 20,
	maxUrlLength: 40,
	maxMeta: 156
};

module.exports = arrayAggregator;

},{}],32:[function(require,module,exports){
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
      length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],33:[function(require,module,exports){
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
      length = array ? array.length : 0,
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

},{}],34:[function(require,module,exports){
var baseIndexOf = require('./_baseIndexOf');

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to search.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

module.exports = arrayIncludes;

},{"./_baseIndexOf":60}],35:[function(require,module,exports){
/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to search.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

module.exports = arrayIncludesWith;

},{}],36:[function(require,module,exports){
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
      length = array ? array.length : 0,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

},{}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){
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
      length = array ? array.length : 0;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayReduce;

},{}],39:[function(require,module,exports){
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
      length = array ? array.length : 0;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

	// Language: Spanish.
	// Source: https://en.wikipedia.org/wiki/Spanish_orthography
	es: [
		{ letter: /[\u00F1]/g, alternative: "n" },
		{ letter: /[\u00D1]/g, alternative: "N" },
		{ letter: /[\u00E1]/g, alternative: "a" },
		{ letter: /[\u00C1]/g, alternative: "A" },
		{ letter: /[\u00E9]/g, alternative: "e" },
		{ letter: /[\u00C9]/g, alternative: "E" },
		{ letter: /[\u00ED]/g, alternative: "i" },
		{ letter: /[\u00CD]/g, alternative: "I" },
		{ letter: /[\u00F3]/g, alternative: "o" },
		{ letter: /[\u00D3]/g, alternative: "O" },
		{ letter: /[\u00FA\u00FC]/g, alternative: "u" },
		{ letter: /[\u00DA\u00DC]/g, alternative: "U" }
	],
	// Language: Polish.
	// Source: https://en.wikipedia.org/wiki/Polish_orthography
	pl: [
		{ letter: /[\u0105]/g, alternative: "a" },
		{ letter: /[\u0104]/g, alternative: "A" },
		{ letter: /[\u0107]/g, alternative: "c" },
		{ letter: /[\u0106]/g, alternative: "C" },
		{ letter: /[\u0119]/g, alternative: "e" },
		{ letter: /[\u0118]/g, alternative: "E" },
		{ letter: /[\u0142]/g, alternative: "l" },
		{ letter: /[\u0141]/g, alternative: "L" },
		{ letter: /[\u0144]/g, alternative: "n" },
		{ letter: /[\u0143]/g, alternative: "N" },
		{ letter: /[\u00F3]/g, alternative: "o" },
		{ letter: /[\u00D3]/g, alternative: "O" },
		{ letter: /[\u015B]/g, alternative: "s" },
		{ letter: /[\u015A]/g, alternative: "S" },
		{ letter: /[\u017A\u017C]/g, alternative: "z" },
		{ letter: /[\u0179\u017B]/g, alternative: "Z" }
	],
	// Language: German.
	// Source: https://en.wikipedia.org/wiki/German_orthography#Special_characters
	de: [
		{ letter: /[\u00E4]/g, alternative: "ae" },
		{ letter: /[\u00C4]/g, alternative: "Ae" },
		{ letter: /[\u00FC]/g, alternative: "ue" },
		{ letter: /[\u00DC]/g, alternative: "Ue" },
		{ letter: /[\u00F6]/g, alternative: "oe" },
		{ letter: /[\u00D6]/g, alternative: "Oe" },
		{ letter: /[\u00DF]/g, alternative: "ss" },
		{ letter: /[\u1E9E]/g, alternative: "SS" }
	],
	// Language Bokmål
	// Source: http://www.dagbladet.no/2011/12/30/tema/reise/reiseeksperter/forbrukerrettigheter/19494227/
	// Language Nynorks
	// Source: http://www.dagbladet.no/2011/12/30/tema/reise/reiseeksperter/forbrukerrettigheter/19494227/
	// Bokmål and Nynorks use the same transliterations
	nbnn: [
		{ letter: /[\u00E6\u04D5]/g, alternative: "ae" },
		{ letter: /[\u00C6\u04D4]/g, alternative: "Ae" },
		{ letter: /[\u00E5]/g, alternative: "aa" },
		{ letter: /[\u00C5]/g, alternative: "Aa" },
		{ letter: /[\u00F8]/g, alternative: "oe" },
		{ letter: /[\u00D8]/g, alternative: "Oe" },
		{ letter: /[\u00E9\u00E8\u00EA]/g, alternative: "e" },
		{ letter: /[\u00C9\u00C8\u00CA]/g, alternative: "E" },
		{ letter: /[\u00F3\u00F2\u00F4]/g, alternative: "o" },
		{ letter: /[\u00D3\u00D2\u00D4]/g, alternative: "O" }
	],
	// Language: Swedish.
	// Sources: https://sv.wikipedia.org/wiki/%C3%85#Historia
	// http://forum.wordreference.com/threads/swedish-%C3%A4-ae-%C3%B6-oe-acceptable.1451839/
	sv: [
		{ letter: /[\u00E5]/g, alternative: "aa" },
		{ letter: /[\u00C5]/g, alternative: "Aa" },
		{ letter: /[\u00E4]/g, alternative: "ae" },
		{ letter: /[\u00C4]/g, alternative: "Ae" },
		{ letter: /[\u00F6]/g, alternative: "oe" },
		{ letter: /[\u00D6]/g, alternative: "Oe" },
		{ letter: /[\u00E9]/g, alternative: "e" },
		{ letter: /[\u00C9]/g, alternative: "E" },
		{ letter: /[\u00E0]/g, alternative: "a" },
		{ letter: /[\u00C0]/g, alternative: "A" }
	],
	// Language: Finnish.
	// Sources: https://www.cs.tut.fi/~jkorpela/lang/finnish-letters.html
	// https://en.wikipedia.org/wiki/Finnish_orthography
	fi: [
		{ letter: /[\u00E5]/g, alternative: "aa" },
		{ letter: /[\u00C5]/g, alternative: "Aa" },
		{ letter: /[\u00E4]/g, alternative: "a" },
		{ letter: /[\u00C4]/g, alternative: "A" },
		{ letter: /[\u00F6]/g, alternative: "o" },
		{ letter: /[\u00D6]/g, alternative: "O" },
		{ letter: /[\u017E]/g, alternative: "zh" },
		{ letter: /[\u017D]/g, alternative: "Zh" },
		{ letter: /[\u0161]/g, alternative: "sh" },
		{ letter: /[\u0160]/g, alternative: "Sh" }
	],
	// Language: Danish.
	// Sources: https://sv.wikipedia.org/wiki/%C3%85#Historia
	// https://en.wikipedia.org/wiki/Danish_orthography
	da: [
		{ letter: /[\u00E5]/g, alternative: "aa" },
		{ letter: /[\u00C5]/g, alternative: "Aa" },
		{ letter: /[\u00E6\u04D5]/g, alternative: "ae" },
		{ letter: /[\u00C6\u04D4]/g, alternative: "Ae" },
		{ letter: /[\u00C4]/g, alternative: "Ae" },
		{ letter: /[\u00F8]/g, alternative: "oe" },
		{ letter: /[\u00D8]/g, alternative: "Oe" },
		{ letter: /[\u00E9]/g, alternative: "e" },
		{ letter: /[\u00C9]/g, alternative: "E" }
	],
	// Language: Turkish.
	// Source: https://en.wikipedia.org/wiki/Turkish_alphabet
	// ‘İ’ is the capital dotted ‘i’. Its lowercase counterpart is the ‘regular’ ‘i’.
	tr: [
		{ letter: /[\u00E7]/g, alternative: "c" },
		{ letter: /[\u00C7]/g, alternative: "C" },
		{ letter: /[\u011F]/g, alternative: "g" },
		{ letter: /[\u011E]/g, alternative: "G" },
		{ letter: /[\u00F6]/g, alternative: "o" },
		{ letter: /[\u00D6]/g, alternative: "O" },
		{ letter: /[\u015F]/g, alternative: "s" },
		{ letter: /[\u015E]/g, alternative: "S" },
		{ letter: /[\u00E2]/g, alternative: "a" },
		{ letter: /[\u00C2]/g, alternative: "A" },
		{ letter: /[\u0131\u00EE]/g, alternative: "i" },
		{ letter: /[\u0130\u00CE]/g, alternative: "I" },
		{ letter: /[\u00FC\u00FB]/g, alternative: "u" },
		{ letter: /[\u00DC\u00DB]/g, alternative: "U" }
	],
	// Language: Latvian.
	// Source: https://en.wikipedia.org/wiki/Latvian_orthography
	lv: [
		{ letter: /[\u0101]/g, alternative: "a" },
		{ letter: /[\u0100]/g, alternative: "A" },
		{ letter: /[\u010D]/g, alternative: "c" },
		{ letter: /[\u010C]/g, alternative: "C" },
		{ letter: /[\u0113]/g, alternative: "e" },
		{ letter: /[\u0112]/g, alternative: "E" },
		{ letter: /[\u0123]/g, alternative: "g" },
		{ letter: /[\u0122]/g, alternative: "G" },
		{ letter: /[\u012B]/g, alternative: "i" },
		{ letter: /[\u012A]/g, alternative: "I" },
		{ letter: /[\u0137]/g, alternative: "k" },
		{ letter: /[\u0136]/g, alternative: "K" },
		{ letter: /[\u013C]/g, alternative: "l" },
		{ letter: /[\u013B]/g, alternative: "L" },
		{ letter: /[\u0146]/g, alternative: "n" },
		{ letter: /[\u0145]/g, alternative: "N" },
		{ letter: /[\u0161]/g, alternative: "s" },
		{ letter: /[\u0160]/g, alternative: "S" },
		{ letter: /[\u016B]/g, alternative: "u" },
		{ letter: /[\u016A]/g, alternative: "U" },
		{ letter: /[\u017E]/g, alternative: "z" },
		{ letter: /[\u017D]/g, alternative: "Z" }
	],
	// Language: Icelandic.
	// Sources: https://en.wikipedia.org/wiki/Thorn_(letter),
	// https://en.wikipedia.org/wiki/Eth,  https://en.wikipedia.org/wiki/Icelandic_orthography
	is: [
		{ letter: /[\u00E1]/g, alternative: "a" },
		{ letter: /[\u00C1]/g, alternative: "A" },
		{ letter: /[\u00F0]/g, alternative: "d" },
		{ letter: /[\u00D0]/g, alternative: "D" },
		{ letter: /[\u00E9]/g, alternative: "e" },
		{ letter: /[\u00C9]/g, alternative: "E" },
		{ letter: /[\u00ED]/g, alternative: "i" },
		{ letter: /[\u00CD]/g, alternative: "I" },
		{ letter: /[\u00F3\u00F6]/g, alternative: "o" },
		{ letter: /[\u00D3\u00D6]/g, alternative: "O" },
		{ letter: /[\u00FA]/g, alternative: "u" },
		{ letter: /[\u00DA]/g, alternative: "U" },
		{ letter: /[\u00FD]/g, alternative: "y" },
		{ letter: /[\u00DD]/g, alternative: "Y" },
		{ letter: /[\u00FE]/g, alternative: "th" },
		{ letter: /[\u00DE]/g, alternative: "Th" },
		{ letter: /[\u00E6\u04D5]/g, alternative: "ae" },
		{ letter: /[\u00C6\u04D4]/g, alternative: "Ae" }
	],
	// Language: Faroese.
	// Source: https://www.facebook.com/groups/1557965757758234/permalink/1749847165236758/ (conversation in private Facebook Group ‘Faroese Language Learning Enthusiasts’)
	// depending on the word, ð can be d, g, j, v, ng or nothing. However, ‘d’ is most frequent.
	// when writing text messages or using a foreign keyboard, í is sometimes written as ij, ý as yj, ú as uv, ó as ov, ø as oe, and á as aa or oa.
	// However, in website URLs the alternatives mentioned below are by far the most common.
	fa: [
		{ letter: /[\u00E1]/g, alternative: "a" },
		{ letter: /[\u00C1]/g, alternative: "A" },
		{ letter: /[\u00F0]/g, alternative: "d" },
		{ letter: /[\u00D0]/g, alternative: "D" },
		{ letter: /[\u00ED]/g, alternative: "i" },
		{ letter: /[\u00CD]/g, alternative: "I" },
		{ letter: /[\u00FD]/g, alternative: "y" },
		{ letter: /[\u00DD]/g, alternative: "Y" },
		{ letter: /[\u00FA]/g, alternative: "u" },
		{ letter: /[\u00DA]/g, alternative: "U" },
		{ letter: /[\u00F3\u00F8]/g, alternative: "o" },
		{ letter: /[\u00D3\u00D8]/g, alternative: "O" },
		{ letter: /[\u00E6\u04D5]/g, alternative: "ae" },
		{ letter: /[\u00C6\u04D4]/g, alternative: "Ae" }
	],
	// Language: Czech.
	// Source: https://en.wikipedia.org/wiki/Czech_orthography
	cs: [
		{ letter: /[\u00E1]/g, alternative: "a" },
		{ letter: /[\u00C1]/g, alternative: "A" },
		{ letter: /[\u010D]/g, alternative: "c" },
		{ letter: /[\u010C]/g, alternative: "C" },
		{ letter: /[\u010F]/g, alternative: "d" },
		{ letter: /[\u010E]/g, alternative: "D" },
		{ letter: /[\u00ED]/g, alternative: "i" },
		{ letter: /[\u00CD]/g, alternative: "I" },
		{ letter: /[\u0148]/g, alternative: "n" },
		{ letter: /[\u0147]/g, alternative: "N" },
		{ letter: /[\u00F3]/g, alternative: "o" },
		{ letter: /[\u00D3]/g, alternative: "O" },
		{ letter: /[\u0159]/g, alternative: "r" },
		{ letter: /[\u0158]/g, alternative: "R" },
		{ letter: /[\u0161]/g, alternative: "s" },
		{ letter: /[\u0160]/g, alternative: "S" },
		{ letter: /[\u0165]/g, alternative: "t" },
		{ letter: /[\u0164]/g, alternative: "T" },
		{ letter: /[\u00FD]/g, alternative: "y" },
		{ letter: /[\u00DD]/g, alternative: "Y" },
		{ letter: /[\u017E]/g, alternative: "z" },
		{ letter: /[\u017D]/g, alternative: "Z" },
		{ letter: /[\u00E9\u011B]/g, alternative: "e" },
		{ letter: /[\u00C9\u011A]/g, alternative: "E" },
		{ letter: /[\u00FA\u016F]/g, alternative: "u" },
		{ letter: /[\u00DA\u016E]/g, alternative: "U" }
	],
	// Language: Russian.
	// Source:  Machine Readable Travel Documents, Doc 9303, Part 1, Volume 1 (PDF) (Sixth ed.).
	// ICAO. 2006. p. IV-50—IV-52. http://www.icao.int/publications/Documents/9303_p3_cons_en.pdf
	// ‘ь’ is the so-called soft sign, indicating a sound change (palatalization) of the preceding consonant.
	// In text it is transliterated to a character similar to an apostroph: ′.
	// I recommend omittance in slugs. (https://en.wikipedia.org/wiki/Romanization_of_Russian)
	ru: [
		{ letter: /[\u0431]/g, alternative: "b" },
		{ letter: /[\u0411]/g, alternative: "B" },
		{ letter: /[\u0432]/g, alternative: "v" },
		{ letter: /[\u0412]/g, alternative: "V" },
		{ letter: /[\u0433]/g, alternative: "g" },
		{ letter: /[\u0413]/g, alternative: "G" },
		{ letter: /[\u0434]/g, alternative: "d" },
		{ letter: /[\u0414]/g, alternative: "D" },
		{ letter: /[\u0436]/g, alternative: "zh" },
		{ letter: /[\u0416]/g, alternative: "Zh" },
		{ letter: /[\u0437]/g, alternative: "z" },
		{ letter: /[\u0417]/g, alternative: "Z" },
		{ letter: /[\u0438\u0439]/g, alternative: "i" },
		{ letter: /[\u0418\u0419]/g, alternative: "I" },
		{ letter: /[\u043A]/g, alternative: "k" },
		{ letter: /[\u041A]/g, alternative: "K" },
		{ letter: /[\u043B]/g, alternative: "l" },
		{ letter: /[\u041B]/g, alternative: "L" },
		{ letter: /[\u043C]/g, alternative: "m" },
		{ letter: /[\u041C]/g, alternative: "M" },
		{ letter: /[\u043D]/g, alternative: "n" },
		{ letter: /[\u041D]/g, alternative: "N" },
		{ letter: /[\u0070]/g, alternative: "r" },
		{ letter: /[\u0050]/g, alternative: "R" },
		{ letter: /[\u043F]/g, alternative: "p" },
		{ letter: /[\u041F]/g, alternative: "P" },
		{ letter: /[\u0441]/g, alternative: "s" },
		{ letter: /[\u0421]/g, alternative: "S" },
		{ letter: /[\u0442]/g, alternative: "t" },
		{ letter: /[\u0422]/g, alternative: "T" },
		{ letter: /[\u0443]/g, alternative: "u" },
		{ letter: /[\u0423]/g, alternative: "U" },
		{ letter: /[\u0444]/g, alternative: "f" },
		{ letter: /[\u0424]/g, alternative: "F" },
		{ letter: /[\u0445]/g, alternative: "kh" },
		{ letter: /[\u0425]/g, alternative: "Kh" },
		{ letter: /[\u0446]/g, alternative: "ts" },
		{ letter: /[\u0426]/g, alternative: "Ts" },
		{ letter: /[\u0447]/g, alternative: "ch" },
		{ letter: /[\u0427]/g, alternative: "Ch" },
		{ letter: /[\u0448]/g, alternative: "sh" },
		{ letter: /[\u0428]/g, alternative: "Sh" },
		{ letter: /[\u0449]/g, alternative: "shch" },
		{ letter: /[\u0429]/g, alternative: "Shch" },
		{ letter: /[\u044A]/g, alternative: "ie" },
		{ letter: /[\u042A]/g, alternative: "Ie" },
		{ letter: /[\u044B]/g, alternative: "y" },
		{ letter: /[\u042B]/g, alternative: "Y" },
		{ letter: /[\u044C]/g, alternative: "" },
		{ letter: /[\u042C]/g, alternative: "" },
		{ letter: /[\u0451\u044D]/g, alternative: "e" },
		{ letter: /[\u0401\u042D]/g, alternative: "E" },
		{ letter: /[\u044E]/g, alternative: "iu" },
		{ letter: /[\u042E]/g, alternative: "Iu" },
		{ letter: /[\u044F]/g, alternative: "ia" },
		{ letter: /[\u042F]/g, alternative: "Ia" }
	],
	// Language: Esperanto.
	// Source: https://en.wikipedia.org/wiki/Esperanto#Writing_diacritics
	eo: [
		{ letter: /[\u0109]/g, alternative: "ch" },
		{ letter: /[\u0108]/g, alternative: "Ch" },
		{ letter: /[\u011d]/g, alternative: "gh" },
		{ letter: /[\u011c]/g, alternative: "Gh" },
		{ letter: /[\u0125]/g, alternative: "hx" },
		{ letter: /[\u0124]/g, alternative: "Hx" },
		{ letter: /[\u0135]/g, alternative: "jx" },
		{ letter: /[\u0134]/g, alternative: "Jx" },
		{ letter: /[\u015d]/g, alternative: "sx" },
		{ letter: /[\u015c]/g, alternative: "Sx" },
		{ letter: /[\u016d]/g, alternative: "ux" },
		{ letter: /[\u016c]/g, alternative: "Ux" }
	],
	// Language: Afrikaans.
	// Source: https://en.wikipedia.org/wiki/Afrikaans#Orthography
	af: [
		{ letter: /[\u00E8\u00EA\u00EB]/g, alternative: "e" },
		{ letter: /[\u00CB\u00C8\u00CA]/g, alternative: "E" },
		{ letter: /[\u00EE\u00EF]/g, alternative: "i" },
		{ letter: /[\u00CE\u00CF]/g, alternative: "I" },
		{ letter: /[\u00F4\u00F6]/g, alternative: "o" },
		{ letter: /[\u00D4\u00D6]/g, alternative: "O" },
		{ letter: /[\u00FB\u00FC]/g, alternative: "u" },
		{ letter: /[\u00DB\u00DC]/g, alternative: "U" }
	],
	// Language: Catalan.
	// Source: https://en.wikipedia.org/wiki/Catalan_orthography
	ca: [
		{ letter: /[\u00E0]/g, alternative: "a" },
		{ letter: /[\u00C0]/g, alternative: "A" },
		{ letter: /[\u00E9|\u00E8]/g, alternative: "e" },
		{ letter: /[\u00C9|\u00C8]/g, alternative: "E" },
		{ letter: /[\u00ED|\u00EF]/g, alternative: "i" },
		{ letter: /[\u00CD|\u00CF]/g, alternative: "I" },
		{ letter: /[\u00F3|\u00F2]/g, alternative: "o" },
		{ letter: /[\u00D3|\u00D2]/g, alternative: "O" },
		{ letter: /[\u00FA|\u00FC]/g, alternative: "u" },
		{ letter: /[\u00DA|\u00DC]/g, alternative: "U" },
		{ letter: /[\u00E7]/g, alternative: "c" },
		{ letter: /[\u00C7]/g, alternative: "C" }
	],
	// Language: Asturian.
	// Source: http://www.orbilat.com/Languages/Asturian/Grammar/Asturian-Alphabet.html
	ast: [
		{ letter: /[\u00F1]/g, alternative: "n" },
		{ letter: /[\u00D1]/g, alternative: "N" }
	],
	// Language: Aragonese.
	// Source: https://en.wikipedia.org/wiki/Aragonese_language#Orthography
	an: [
		{ letter: /[\u00FC]/g, alternative: "u" },
		{ letter: /[\u00F1]/g, alternative: "ny" },
		{ letter: /[\u00E7]/g, alternative: "c" },
		{ letter: /[\u00ED]/g, alternative: "i" },
		{ letter: /[\u00F3]/g, alternative: "o" },
		{ letter: /[\u00E1]/g, alternative: "a" },
		{ letter: /[\u00DC]/g, alternative: "U" },
		{ letter: /[\u00D1]/g, alternative: "Ny" },
		{ letter: /[\u00C7]/g, alternative: "C" },
		{ letter: /[\u00CD]/g, alternative: "I" },
		{ letter: /[\u00D3]/g, alternative: "O" },
		{ letter: /[\u00C1]/g, alternative: "A" }
	],
	// Language: Aymara.
	// Source: http://www.omniglot.com/writing/aymara.htm
	ay: [
		{ letter: /(([\u00EF])|([\u00ED]))/g, alternative: "i" },
		{ letter: /(([\u00CF])|([\u00CD]))/g, alternative: "I" },
		{ letter: /[\u00E4]/g, alternative: "a" },
		{ letter: /[\u00C4]/g, alternative: "A" },
		{ letter: /[\u00FC]/g, alternative: "u" },
		{ letter: /[\u00DC]/g, alternative: "U" },
		{ letter: /[\u0027]/g, alternative: "" },
		{ letter: /[\u00F1]/g, alternative: "n" },
		{ letter: /[\u00D1]/g, alternative: "N" }
	],
	// Language: English.
	// Sources: https://en.wikipedia.org/wiki/English_terms_with_diacritical_marks https://en.wikipedia.org/wiki/English_orthography
	en: [
		{ letter: /[\u00E6\u04D5]/g, alternative: "ae" },
		{ letter: /[\u00C6\u04D4]/g, alternative: "Ae" },
		{ letter: /[\u0153]/g, alternative: "oe" },
		{ letter: /[\u0152]/g, alternative: "Oe" },
		{ letter: /[\u00EB\u00E9]/g, alternative: "e" },
		{ letter: /[\u00C9\u00CB]/g, alternative: "E" },
		{ letter: /[\u00F4\u00F6]/g, alternative: "o" },
		{ letter: /[\u00D4\u00D6]/g, alternative: "O" },
		{ letter: /[\u00EF]/g, alternative: "i" },
		{ letter: /[\u00CF]/g, alternative: "I" },
		{ letter: /[\u00E7]/g, alternative: "c" },
		{ letter: /[\u00C7]/g, alternative: "C" },
		{ letter: /[\u00F1]/g, alternative: "n" },
		{ letter: /[\u00D1]/g, alternative: "N" },
		{ letter: /[\u00FC]/g, alternative: "u" },
		{ letter: /[\u00DC]/g, alternative: "U" },
		{ letter: /[\u00E4]/g, alternative: "a" },
		{ letter: /[\u00C4]/g, alternative: "A" }
	],
	// Language: French.
	// Sources: https://en.wikipedia.org/wiki/French_orthography#Ligatures https://en.wikipedia.org/wiki/French_orthography#Diacritics
	fr: [
		{ letter: /[\u00E6\u04D5]/g, alternative: "ae" },
		{ letter: /[\u00C6\u04D4]/g, alternative: "Ae" },
		{ letter: /[\u0153]/g, alternative: "oe" },
		{ letter: /[\u0152]/g, alternative: "Oe" },
		{ letter: /[\u00E9\u00E8\u00EB\u00EA]/g, alternative: "e" },
		{ letter: /[\u00C9\u00C8\u00CB\u00CA]/g, alternative: "E" },
		{ letter: /[\u00E0\u00E2]/g, alternative: "a" },
		{ letter: /[\u00C0\u00C2]/g, alternative: "A" },
		{ letter: /[\u00EF\u00EE]/g, alternative: "i" },
		{ letter: /[\u00CF\u00CE]/g, alternative: "I" },
		{ letter: /[\u00F9\u00FB\u00FC]/g, alternative: "u" },
		{ letter: /[\u00D9\u00DB\u00DC]/g, alternative: "U" },
		{ letter: /[\u00F4]/g, alternative: "o" },
		{ letter: /[\u00D4]/g, alternative: "O" },
		{ letter: /[\u00FF]/g, alternative: "y" },
		{ letter: /[\u0178]/g, alternative: "Y" },
		{ letter: /[\u00E7]/g, alternative: "c" },
		{ letter: /[\u00C7]/g, alternative: "C" },
		{ letter: /[\u00F1]/g, alternative: "n" },
		{ letter: /[\u00D1]/g, alternative: "N" }
	],
	// Language: Italian.
	// Source: https://en.wikipedia.org/wiki/Italian_orthography
	it: [
		{ letter: /[\u00E0]/g, alternative: "a" },
		{ letter: /[\u00C0]/g, alternative: "A" },
		{ letter: /[\u00E9\u00E8]/g, alternative: "e" },
		{ letter: /[\u00C9\u00C8]/g, alternative: "E" },
		{ letter: /[\u00EC\u00ED\u00EE]/g, alternative: "i" },
		{ letter: /[\u00CC\u00CD\u00CE]/g, alternative: "I" },
		{ letter: /[\u00F3\u00F2]/g, alternative: "o" },
		{ letter: /[\u00D3\u00D2]/g, alternative: "O" },
		{ letter: /[\u00F9\u00FA]/g, alternative: "u" },
		{ letter: /[\u00D9\u00DA]/g, alternative: "U" }
	],
	// Language: Dutch.
	// Sources: https://en.wikipedia.org/wiki/Dutch_orthography https://nl.wikipedia.org/wiki/Trema_in_de_Nederlandse_spelling
	nl: [
		{ letter: /[\u00E7]/g, alternative: "c" },
		{ letter: /[\u00C7]/g, alternative: "C" },
		{ letter: /[\u00F1]/g, alternative: "n" },
		{ letter: /[\u00D1]/g, alternative: "N" },
		{ letter: /[\u00E9\u00E8\u00EA\u00EB]/g, alternative: "e" },
		{ letter: /[\u00C9\u00C8\u00CA\u00CB]/g, alternative: "E" },
		{ letter: /[\u00F4\u00F6]/g, alternative: "o" },
		{ letter: /[\u00D4\u00D6]/g, alternative: "O" },
		{ letter: /[\u00EF]/g, alternative: "i" },
		{ letter: /[\u00CF]/g, alternative: "I" },
		{ letter: /[\u00FC]/g, alternative: "u" },
		{ letter: /[\u00DC]/g, alternative: "U" },
		{ letter: /[\u00E4]/g, alternative: "a" },
		{ letter: /[\u00C4]/g, alternative: "A" }
	],
	// Language: Bambara.
	// Sources: http://www.omniglot.com/writing/bambara.htm https://en.wikipedia.org/wiki/Bambara_language
	bm: [
		{ letter: /[\u025B]/g, alternative: "e" },
		{ letter: /[\u0190]/g, alternative: "E" },
		{ letter: /[\u0272]/g, alternative: "ny" },
		{ letter: /[\u019D]/g, alternative: "Ny" },
		{ letter: /[\u014B]/g, alternative: "ng" },
		{ letter: /[\u014A]/g, alternative: "Ng" },
		{ letter: /[\u0254]/g, alternative: "o" },
		{ letter: /[\u0186]/g, alternative: "O" }
	],
	// Language: Ukrainian.
	// Source: Resolution no. 55 of the Cabinet of Ministers of Ukraine, January 27, 2010 http://zakon2.rada.gov.ua/laws/show/55-2010-%D0%BF
	// ‘ь’ is the so-called soft sign, indicating a sound change (palatalization) of the preceding consonant. In text it is sometimes transliterated
	// to a character similar to an apostroph: ′. Omittance is recommended in slugs (https://en.wikipedia.org/wiki/Romanization_of_Ukrainian).
	uk: [
		{ letter: /[\u0431]/g, alternative: "b" },
		{ letter: /[\u0411]/g, alternative: "B" },
		{ letter: /[\u0432]/g, alternative: "v" },
		{ letter: /[\u0412]/g, alternative: "V" },
		{ letter: /[\u0433]/g, alternative: "h" },
		{ letter: /[\u0413]/g, alternative: "H" },
		{ letter: /[\u0491]/g, alternative: "g" },
		{ letter: /[\u0490]/g, alternative: "G" },
		{ letter: /[\u0434]/g, alternative: "d" },
		{ letter: /[\u0414]/g, alternative: "D" },
		{ letter: /[\u043A]/g, alternative: "k" },
		{ letter: /[\u041A]/g, alternative: "K" },
		{ letter: /[\u043B]/g, alternative: "l" },
		{ letter: /[\u041B]/g, alternative: "L" },
		{ letter: /[\u043C]/g, alternative: "m" },
		{ letter: /[\u041C]/g, alternative: "M" },
		{ letter: /[\u0070]/g, alternative: "r" },
		{ letter: /[\u0050]/g, alternative: "R" },
		{ letter: /[\u043F]/g, alternative: "p" },
		{ letter: /[\u041F]/g, alternative: "P" },
		{ letter: /[\u0441]/g, alternative: "s" },
		{ letter: /[\u0421]/g, alternative: "S" },
		{ letter: /[\u0442]/g, alternative: "t" },
		{ letter: /[\u0422]/g, alternative: "T" },
		{ letter: /[\u0443]/g, alternative: "u" },
		{ letter: /[\u0423]/g, alternative: "U" },
		{ letter: /[\u0444]/g, alternative: "f" },
		{ letter: /[\u0424]/g, alternative: "F" },
		{ letter: /[\u0445]/g, alternative: "kh" },
		{ letter: /[\u0425]/g, alternative: "Kh" },
		{ letter: /[\u0446]/g, alternative: "ts" },
		{ letter: /[\u0426]/g, alternative: "Ts" },
		{ letter: /[\u0447]/g, alternative: "ch" },
		{ letter: /[\u0427]/g, alternative: "Ch" },
		{ letter: /[\u0448]/g, alternative: "sh" },
		{ letter: /[\u0428]/g, alternative: "Sh" },
		{ letter: /[\u0449]/g, alternative: "shch" },
		{ letter: /[\u0429]/g, alternative: "Shch" },
		{ letter: /[\u044C\u042C]/g, alternative: "" },
		{ letter: /[\u0436]/g, alternative: "zh" },
		{ letter: /[\u0416]/g, alternative: "Zh" },
		{ letter: /[\u0437]/g, alternative: "z" },
		{ letter: /[\u0417]/g, alternative: "Z" },
		{ letter: /[\u0438]/g, alternative: "y" },
		{ letter: /[\u0418]/g, alternative: "Y" },
		{ letter: /^[\u0454]/g, alternative: "ye" },
		{ letter: /[\s][\u0454]/g, alternative: " ye" },
		{ letter: /[\u0454]/g, alternative: "ie" },
		{ letter: /^[\u0404]/g, alternative: "Ye" },
		{ letter: /[\s][\u0404]/g, alternative: " Ye" },
		{ letter: /[\u0404]/g, alternative: "IE" },
		{ letter: /^[\u0457]/g, alternative: "yi" },
		{ letter: /[\s][\u0457]/g, alternative: " yi" },
		{ letter: /[\u0457]/g, alternative: "i" },
		{ letter: /^[\u0407]/g, alternative: "Yi" },
		{ letter: /[\s][\u0407]/g, alternative: " Yi" },
		{ letter: /[\u0407]/g, alternative: "I" },
		{ letter: /^[\u0439]/g, alternative: "y" },
		{ letter: /[\s][\u0439]/g, alternative: " y" },
		{ letter: /[\u0439]/g, alternative: "i" },
		{ letter: /^[\u0419]/g, alternative: "Y" },
		{ letter: /[\s][\u0419]/g, alternative: " Y" },
		{ letter: /[\u0419]/g, alternative: "I" },
		{ letter: /^[\u044E]/g, alternative: "yu" },
		{ letter: /[\s][\u044E]/g, alternative: " yu" },
		{ letter: /[\u044E]/g, alternative: "iu" },
		{ letter: /^[\u042E]/g, alternative: "Yu" },
		{ letter: /[\s][\u042E]/g, alternative: " Yu" },
		{ letter: /[\u042E]/g, alternative: "IU" },
		{ letter: /^[\u044F]/g, alternative: "ya" },
		{ letter: /[\s][\u044F]/g, alternative: " ya" },
		{ letter: /[\u044F]/g, alternative: "ia" },
		{ letter: /^[\u042F]/g, alternative: "Ya" },
		{ letter: /[\s][\u042F]/g, alternative: " Ya" },
		{ letter: /[\u042F]/g, alternative: "IA" }
	]
};

/**
 * The function returning an array containing transliteration objects, based on the given locale.
 *
 * @param {string} locale The locale.
 * @returns {Array} An array containing transliteration objects.
 */
module.exports = function( locale ) {
	if ( isUndefined( locale ) ) {
		return [];
	}
	switch( getLanguage( locale ) ) {
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
		default:
			return [];
	}
};

},{"lodash/isUndefined":315}],39:[function(require,module,exports){
/** @module config/twoPartTransitionWords */

/**
 * Returns an array with two-part transition words to be used by the assessments.
 * @returns {Array} The array filled with two-part transition words.
 */
module.exports = function() {
	return [ [ "both", "and" ], [ "if", "then" ], [ "not only", "but also" ], [ "neither", "nor" ], [ "either", "or" ], [ "not", "but" ],
		[ "whether", "or" ], [ "no sooner", "than" ] ];
};


},{}],40:[function(require,module,exports){
var Assessor = require( "./assessor.js" );

var fleschReadingEase = require( "./assessments/fleschReadingEaseAssessment.js" );
var paragraphTooLong = require( "./assessments/paragraphTooLongAssessment.js" );
var sentenceLengthInText = require( "./assessments/sentenceLengthInTextAssessment.js" );
var subHeadingLength = require( "./assessments/getSubheadingLengthAssessment.js" );
var subheadingDistributionTooLong = require( "./assessments/subheadingDistributionTooLongAssessment.js" );
var getSubheadingPresence = require( "./assessments/subheadingPresenceAssessment.js" );
var transitionWords = require( "./assessments/transitionWordsAssessment.js" );
var passiveVoice = require( "./assessments/passiveVoiceAssessment.js" );
// var sentenceVariation = require( "./assessments/sentenceVariationAssessment.js" );
// var sentenceBeginnings = require( "./assessments/sentenceBeginningsAssessment.js" );
// var wordComplexity = require( "./assessments/wordComplexityAssessment.js" );
// var subheadingDistributionTooShort = require( "./assessments/subheadingDistributionTooShortAssessment.js" );
// var paragraphTooShort = require( "./assessments/paragraphTooShortAssessment.js" );
// var sentenceLengthInDescription = require( "./assessments/sentenceLengthInDescriptionAssessment.js" );
var textPresence = require( "./assessments/textPresenceAssessment.js" );

var scoreToRating = require( "./interpreters/scoreToRating" );

var map = require( "lodash/map" );
var sum = require( "lodash/sum" );

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
var ContentAssessor = function( i18n, options ) {
	Assessor.call( this, i18n, options );

	this._assessments = [
		fleschReadingEase,
		getSubheadingPresence,
		subheadingDistributionTooLong,
		subHeadingLength,
		paragraphTooLong,
		sentenceLengthInText,
		transitionWords,
		passiveVoice,
		// sentenceVariation,
		// sentenceBeginnings,
		// wordComplexity,
		// subheadingDistributionTooShort,
		// paragraphTooShort
		// sentenceLengthInDescription,
		textPresence
	];
};

require( "util" ).inherits( ContentAssessor, Assessor );

/**
 * Calculates the negative points based on the assessment results.
 *
 * @returns {number} The total negative points for the results.
 */
ContentAssessor.prototype.calculateNegativePoints = function() {
	var results = this.getValidResults();

	var negativePoints = map( results, function( result ) {
		var weight, rating = scoreToRating( result.getScore() );

		// Convert the ratings to negative 'points'.
		switch ( rating ) {
			case "bad":
				weight = 1;
				break;

			case "ok":
				weight = 1 / 2;
				break;

			default:
			case "good":
				weight = 0;
				break;
		}

		return weight;
	} );

	return sum( negativePoints );
};

/**
 * Rates the negative points
 *
 * @param {number} totalNegativePoints The amount of negative points.
 * @returns {number} The score based on the amount of negative points.
 *
 * @private
 */
ContentAssessor.prototype._rateNegativePoints = function( totalNegativePoints ) {
	// Determine the total score based on the total negative points.
	if ( totalNegativePoints < 2 ) {
		// A green indicator.
		return 90;
	}

	if ( totalNegativePoints < 4 ) {
		// An orange indicator.
		return 60;
	}

	// A red indicator.
	return 30;
};

/**
 * Calculates the overall score based on the assessment results.
 *
 * @returns {number} The overall score.
 */
ContentAssessor.prototype.calculateOverallScore = function() {
	var results = this.getValidResults();

	// If you have no content, you have a red indicator.
	if ( results.length === 0 ) {
		return 30;
	}

	var totalNegativePoints = this.calculateNegativePoints();

	return this._rateNegativePoints( totalNegativePoints );
};

module.exports = ContentAssessor;


},{"./assessments/fleschReadingEaseAssessment.js":4,"./assessments/getSubheadingLengthAssessment.js":5,"./assessments/paragraphTooLongAssessment.js":12,"./assessments/passiveVoiceAssessment.js":13,"./assessments/sentenceLengthInTextAssessment.js":14,"./assessments/subheadingDistributionTooLongAssessment.js":15,"./assessments/subheadingPresenceAssessment.js":16,"./assessments/textPresenceAssessment.js":22,"./assessments/transitionWordsAssessment.js":25,"./assessor.js":29,"./interpreters/scoreToRating":49,"lodash/map":318,"lodash/sum":330,"util":516}],41:[function(require,module,exports){
/**
 * Throws an invalid type error
 * @param {string} message The message to show when the error is thrown
 * @returns {void}
 */
module.exports = function InvalidTypeError( message ) {
	Error.captureStackTrace( this, this.constructor );
	this.name = this.constructor.name;
	this.message = message;
};

require( "util" ).inherits( module.exports, Error );

},{"util":516}],42:[function(require,module,exports){
module.exports = function MissingArgumentError( message ) {
	Error.captureStackTrace( this, this.constructor );
	this.name = this.constructor.name;
	this.message = message;
};

require( "util" ).inherits( module.exports, Error );

},{"util":516}],43:[function(require,module,exports){
var forEach = require( "lodash/forEach" );

/**
 * Adds a class to an element
 *
 * @param {HTMLElement} element The element to add the class to.
 * @param {string} className The class to add.
 * @returns {void}
 */
var addClass = function( element, className ) {
	var classes = element.className.split( " " );

	if ( -1 === classes.indexOf( className ) ) {
		classes.push( className );
	}

	element.className = classes.join( " " );
};

/**
 * Removes a class from an element
 *
 * @param {HTMLElement} element The element to remove the class from.
 * @param {string} className The class to remove.
 * @returns {void}
 */
var removeClass = function( element, className ) {
	var classes = element.className.split( " " );
	var foundClass = classes.indexOf( className );

	if ( -1 !== foundClass ) {
		classes.splice( foundClass, 1 );
	}

	element.className = classes.join( " " );
};

/**
 * Removes multiple classes from an element
 *
 * @param {HTMLElement} element The element to remove the classes from.
 * @param {Array} classes A list of classes to remove
 * @returns {void}
 */
var removeClasses = function( element, classes ) {
	forEach( classes, this.removeClass.bind( null, element ) );
};

/**
 * Checks whether an element has a specific class.
 *
 * @param {HTMLElement} element The element to check for the class.
 * @param {string} className The class to look for.
 * @returns {boolean} Whether or not the class is present.
 */
var hasClass = function( element, className ) {
	return element.className.indexOf( className ) > -1;
};

module.exports = {
	hasClass: hasClass,
	addClass: addClass,
	removeClass: removeClass,
	removeClasses: removeClasses
};

},{"lodash/forEach":292}],44:[function(require,module,exports){
var isUndefined = require( "lodash/isUndefined" );

/**
 * Shows and error trace of the error message in the console if the console is available.
 *
 * @param {string} [errorMessage=""] The error message.
 */
function showTrace( errorMessage ) {
	if ( isUndefined( errorMessage ) ) {
		errorMessage = "";
	}

	if (
		!isUndefined( console ) &&
		!isUndefined( console.trace )
	) {
		console.trace( errorMessage );
	}
}

module.exports = {
	showTrace: showTrace
};

},{"lodash/isUndefined":315}],45:[function(require,module,exports){
/**
 * Returns rounded number to fix floating point bug http://floating-point-gui.de
 * @param {number} number The unrounded number
 * @returns {number} Rounded number
 */
module.exports = function ( number ) {

	if ( Math.round( number ) === number ) {
		return Math.round( number );
	}

	return Math.round( number * 10 ) / 10;
};

},{}],46:[function(require,module,exports){
var blockElements = [ "address", "article", "aside", "blockquote", "canvas", "dd", "div", "dl", "fieldset", "figcaption",
	"figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "li", "main", "nav",
	"noscript", "ol", "output", "p", "pre", "section", "table", "tfoot", "ul", "video" ];
var inlineElements = [ "b", "big", "i", "small", "tt", "abbr", "acronym", "cite", "code", "dfn", "em", "kbd", "strong",
	"samp", "time", "var", "a", "bdo", "br", "img", "map", "object", "q", "script", "span", "sub", "sup", "button",
	"input", "label", "select", "textarea" ];

var blockElementsRegex = new RegExp( "^(" + blockElements.join( "|" ) + ")$", "i" );
var inlineElementsRegex = new RegExp( "^(" + inlineElements.join( "|" ) + ")$", "i" );

var blockElementStartRegex = new RegExp( "^<(" + blockElements.join( "|" ) + ")[^>]*?>$", "i" );
var blockElementEndRegex = new RegExp( "^</(" + blockElements.join( "|" ) + ")[^>]*?>$", "i" );

var inlineElementStartRegex = new RegExp( "^<(" + inlineElements.join( "|" ) + ")[^>]*>$", "i" );
var inlineElementEndRegex = new RegExp( "^</(" + inlineElements.join( "|" ) + ")[^>]*>$", "i" );

var otherElementStartRegex = /^<([^>\s\/]+)[^>]*>$/;
var otherElementEndRegex = /^<\/([^>\s]+)[^>]*>$/;

var contentRegex = /^[^<]+$/;
var greaterThanContentRegex = /^<[^><]*$/;

var commentRegex = /<!--(.|[\r\n])*?-->/g;

var core = require( "tokenizer2/core" );
var forEach = require( "lodash/forEach" );
var memoize = require( "lodash/memoize" );

var tokens = [];
var htmlBlockTokenizer;

/**
 * Creates a tokenizer to tokenize HTML into blocks.
 */
function createTokenizer() {
	tokens = [];

	htmlBlockTokenizer = core( function( token ) {
		tokens.push( token );
	} );

	htmlBlockTokenizer.addRule( contentRegex, "content" );
	htmlBlockTokenizer.addRule( greaterThanContentRegex, "greater-than-sign-content" );

	htmlBlockTokenizer.addRule( blockElementStartRegex, "block-start" );
	htmlBlockTokenizer.addRule( blockElementEndRegex, "block-end" );
	htmlBlockTokenizer.addRule( inlineElementStartRegex, "inline-start" );
	htmlBlockTokenizer.addRule( inlineElementEndRegex, "inline-end" );

	htmlBlockTokenizer.addRule( otherElementStartRegex, "other-element-start" );
	htmlBlockTokenizer.addRule( otherElementEndRegex, "other-element-end" );
}

/**
 * Returns whether or not the given element name is a block element.
 *
 * @param {string} htmlElementName The name of the HTML element.
 * @returns {boolean} Whether or not it is a block element.
 */
function isBlockElement( htmlElementName ) {
	return blockElementsRegex.test( htmlElementName );
}

/**
 * Returns whether or not the given element name is an inline element.
 *
 * @param {string} htmlElementName The name of the HTML element.
 * @returns {boolean} Whether or not it is an inline element.
 */
function isInlineElement( htmlElementName ) {
	return inlineElementsRegex.test( htmlElementName );
}

/**
 * Splits a text into blocks based on HTML block elements.
 *
 * @param {string} text The text to split.
 * @returns {Array} A list of blocks based on HTML block elements.
 */
function getBlocks( text ) {
	var blocks = [], depth = 0,
		blockStartTag = "",
		currentBlock = "",
		blockEndTag = "";

	// Remove all comments because it is very hard to tokenize them.
	text = text.replace( commentRegex, "" );

	createTokenizer();
	htmlBlockTokenizer.onText( text );

	htmlBlockTokenizer.end();

	forEach( tokens, function( token, i ) {
		var nextToken = tokens[ i + 1 ];

		switch ( token.type ) {

			case "content":
			case "greater-than-sign-content":
			case "inline-start":
			case "inline-end":
			case "other-tag":
			case "other-element-start":
			case "other-element-end":
			case "greater than sign":
				if ( !nextToken || ( depth === 0 && ( nextToken.type === "block-start" || nextToken.type === "block-end" ) ) ) {
					currentBlock += token.src;

					blocks.push( currentBlock );
					blockStartTag = "";
					currentBlock = "";
					blockEndTag = "";
				} else {
					currentBlock += token.src;
				}
				break;

			case "block-start":
				if ( depth !== 0 ) {
					if ( currentBlock.trim() !== "" ) {
						blocks.push( currentBlock );
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
				if ( "" !== blockStartTag && "" !== blockEndTag ) {
					blocks.push( blockStartTag + currentBlock + blockEndTag );
				} else if ( "" !== currentBlock.trim() ) {
					blocks.push( currentBlock );
				}
				blockStartTag = "";
				currentBlock = "";
				blockEndTag = "";
				break;
		}

		// Handles HTML with too many closing tags.
		if ( depth < 0 ) {
			depth = 0;
		}
	} );

	return blocks;
}

module.exports = {
	blockElements: blockElements,
	inlineElements: inlineElements,
	isBlockElement: isBlockElement,
	isInlineElement: isInlineElement,
	getBlocks: memoize( getBlocks )
};

},{"lodash/forEach":292,"lodash/memoize":319,"tokenizer2/core":338}],47:[function(require,module,exports){
/**
 * Checks if `n` is between `start` and up to, but not including, `start`.
 *
 * @param {number} number The number to check.
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
function inRangeEndInclusive( number, start, end ) {
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
function inRangeStartInclusive( number, start, end ) {
	return number >= start && number < end;
}

/**
 * Checks if `n` is between `start` and up to, but not including, `start`.
 *
 * @param {number} number The number to check.
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
function inRange( number, start, end ) {
	return inRangeEndInclusive( number, start, end );
}

module.exports = {
	inRange: inRange,
	inRangeStartInclusive: inRangeStartInclusive,
	inRangeEndInclusive: inRangeEndInclusive
};

},{}],48:[function(require,module,exports){
/**
 * Returns true or false, based on the length of the value text and the recommended value.
 *
 * @param {number} recommendedValue The recommended value.
 * @param {number} valueLength      The length of the value to check.
 * @returns {boolean} True if the length is greater than the recommendedValue, false if it is smaller.
 */
module.exports = function( recommendedValue, valueLength ) {
	return valueLength > recommendedValue;
};

},{}],49:[function(require,module,exports){
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

},{}],50:[function(require,module,exports){
/**
 * Returns an array with exceptions for the sentence beginning researcher.
 * @returns {Array} The array filled with exceptions.
 */
module.exports = function() {
	return [ "A", "An", "The", "This", "That", "These", "Those", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten" ];
};

},{}],51:[function(require,module,exports){
module.exports = function() {
	return [ " ", "\\n", "\\r", "\\t", ".", ",", "'", "(", ")", "\"", "+", "-", ";", "!", "?", ":", "/", "»", "«", "‹", "›", "<", ">" ];
};

},{}],52:[function(require,module,exports){
/**
 * Marks a text with HTML tags
 *
 * @param {string} text The unmarked text.
 * @returns {string} The marked text.
 */
module.exports = function( text ) {
	return "<yoastmark class='yoast-text-mark'>" + text + "</yoastmark>";
};

},{}],53:[function(require,module,exports){
var uniqBy = require( "lodash/uniqBy" );

/**
 * Removes duplicate marks from an array
 *
 * @param {Array} marks The marks to remove duplications from
 * @returns {Array} A list of de-duplicated marks.
 */
function removeDuplicateMarks( marks ) {
	return uniqBy( marks, function( mark ) {
		return mark.getOriginal();
	} );
}

module.exports = removeDuplicateMarks;

},{"lodash/uniqBy":336}],54:[function(require,module,exports){
/**
 * Removes all marks from a text
 *
 * @param {string} text The marked text.
 * @returns {string} The unmarked text.
 */
module.exports = function( text ) {
	return text
		.replace( new RegExp( "<yoastmark[^>]*>", "g" ), "" )
		.replace( new RegExp( "</yoastmark>", "g" ), "" );
};

},{}],55:[function(require,module,exports){
/* global console: true */
/* global setTimeout: true */
var isUndefined = require( "lodash/isUndefined" );
var forEach = require( "lodash/forEach" );
var reduce = require( "lodash/reduce" );
var isString = require( "lodash/isString" );
var isObject = require( "lodash/isObject" );
var InvalidTypeError = require( "./errors/invalidType" );

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

/**
 * Setup Pluggable and set its default values.
 *
 * @constructor
 * @param       {App}       app                 The App object to attach to.
 * @property    {number}    preloadThreshold	The maximum time plugins are allowed to preload before we load our content analysis.
 * @property    {object}    plugins             The plugins that have been registered.
 * @property    {object}    modifications 	    The modifications that have been registered. Every modification contains an array with callables.
 * @property    {Array}     customTests         All tests added by plugins.
 */
var Pluggable = function( app ) {
	this.app = app;
	this.loaded = false;
	this.preloadThreshold = 3000;
	this.plugins = {};
	this.modifications = {};
	this.customTests = [];

	// Allow plugins 1500 ms to register before we start polling their
	setTimeout( this._pollLoadingPlugins.bind( this ), 1500 );
};

//  ***** DSL IMPLEMENTATION ***** //

/**
 * Register a plugin with YoastSEO. A plugin can be declared "ready" right at registration or later using `this.ready`.
 *
 * @param {string}  pluginName      The name of the plugin to be registered.
 * @param {object}  options         The options passed by the plugin.
 * @param {string}  options.status  The status of the plugin being registered. Can either be "loading" or "ready".
 * @returns {boolean}               Whether or not the plugin was successfully registered.
 */
Pluggable.prototype._registerPlugin = function( pluginName, options ) {
	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to register plugin. Expected parameter `pluginName` to be a string." );
		return false;
	}

	if ( !isUndefined( options ) && typeof options !== "object" ) {
		console.error( "Failed to register plugin " + pluginName + ". Expected parameters `options` to be a object." );
		return false;
	}

	if ( this._validateUniqueness( pluginName ) === false ) {
		console.error( "Failed to register plugin. Plugin with name " + pluginName + " already exists" );
		return false;
	}

	this.plugins[ pluginName ] = options;
	this.app.updateLoadingDialog( this.plugins );
	return true;
};

/**
 * Declare a plugin "ready". Use this if you need to preload data with AJAX.
 *
 * @param {string} pluginName	The name of the plugin to be declared as ready.
 * @returns {boolean}           Whether or not the plugin was successfully declared ready.
 */
Pluggable.prototype._ready = function( pluginName ) {
	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to modify status for plugin " + pluginName + ". Expected parameter `pluginName` to be a string." );
		return false;
	}

	if ( isUndefined( this.plugins[ pluginName ] ) ) {
		console.error( "Failed to modify status for plugin " + pluginName + ". The plugin was not properly registered." );
		return false;
	}

	this.plugins[ pluginName ].status = "ready";
	this.app.updateLoadingDialog( this.plugins );
	return true;
};

/**
 * Used to declare a plugin has been reloaded. If an analysis is currently running. We will reset it to ensure running the latest modifications.
 *
 * @param {string} pluginName   The name of the plugin to be declared as reloaded.
 * @returns {boolean}           Whether or not the plugin was successfully declared as reloaded.
 */
Pluggable.prototype._reloaded = function( pluginName ) {
	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to reload Content Analysis for " + pluginName + ". Expected parameter `pluginName` to be a string." );
		return false;
	}

	if ( isUndefined( this.plugins[ pluginName ] ) ) {
		console.error( "Failed to reload Content Analysis for plugin " + pluginName + ". The plugin was not properly registered." );
		return false;
	}

	this.app.refresh();
	return true;
};

/**
 * Enables hooking a callable to a specific data filter supported by YoastSEO. Can only be performed for plugins that have finished loading.
 *
 * @param {string}      modification	The name of the filter
 * @param {function}    callable 	    The callable
 * @param {string}      pluginName 	    The plugin that is registering the modification.
 * @param {number}      priority	    (optional) Used to specify the order in which the callables associated with a particular filter are called.
 * 									    Lower numbers correspond with earlier execution.
 * @returns {boolean}                   Whether or not applying the hook was successfull.
 */
Pluggable.prototype._registerModification = function( modification, callable, pluginName, priority ) {
	if ( typeof modification !== "string" ) {
		console.error( "Failed to register modification for plugin " + pluginName + ". Expected parameter `modification` to be a string." );
		return false;
	}

	if ( typeof callable !== "function" ) {
		console.error( "Failed to register modification for plugin " + pluginName + ". Expected parameter `callable` to be a function." );
		return false;
	}

	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to register modification for plugin " + pluginName + ". Expected parameter `pluginName` to be a string." );
		return false;
	}

	// Validate origin
	if ( this._validateOrigin( pluginName ) === false ) {
		console.error( "Failed to register modification for plugin " + pluginName + ". The integration has not finished loading yet." );
		return false;
	}

	// Default priority to 10
	var prio = typeof priority === "number" ?  priority : 10;

	var callableObject = {
		callable: callable,
		origin: pluginName,
		priority: prio
	};

	// Make sure modification is defined on modifications object
	if ( isUndefined( this.modifications[ modification ] ) ) {
		this.modifications[ modification ] = [];
	}

	this.modifications[ modification ].push( callableObject );

	return true;
};

/**
 * Register test for a specific plugin
 *
 * @deprecated
 */
Pluggable.prototype._registerTest = function() {
	console.error( "This function is deprecated, please use _registerAssessment" );
};

/**
 * Register an assessment for a specific plugin
 *
 * @param {object} assessor The assessor object where the assessments needs to be added.
 * @param {string} name The name of the assessment.
 * @param {function} assessment The function to run as an assessment.
 * @param {string} pluginName The name of the plugin associated with the assessment.
 * @returns {boolean} Whether registering the assessment was successful.
 * @private
 */
Pluggable.prototype._registerAssessment = function( assessor, name, assessment, pluginName ) {
	if ( !isString( name ) ) {
		throw new InvalidTypeError( "Failed to register test for plugin " + pluginName + ". Expected parameter `name` to be a string." );
	}

	if ( !isObject( assessment ) ) {
		throw new InvalidTypeError( "Failed to register assessment for plugin " + pluginName +
			". Expected parameter `assessment` to be a function." );
	}

	if ( !isString( pluginName ) ) {
		throw new InvalidTypeError( "Failed to register assessment for plugin " + pluginName +
			". Expected parameter `pluginName` to be a string." );
	}

	// Prefix the name with the pluginName so the test name is always unique.
	name = pluginName + "-" + name;

	assessor.addAssessment( name, assessment );

	return true;
};

// ***** PRIVATE HANDLERS *****//

/**
 * Poller to handle loading of plugins. Plugins can register with our app to let us know they are going to hook into our Javascript. They are allowed
 * 5 seconds of pre-loading time to fetch all the data they need to be able to perform their data modifications. We will only apply data modifications
 * from plugins that have declared ready within the pre-loading time in order to safeguard UX and data integrity.
 *
 * @param   {number} pollTime (optional) The accumulated time to compare with the pre-load threshold.
 * @returns {void}
 * @private
 */
Pluggable.prototype._pollLoadingPlugins = function( pollTime ) {
	pollTime = isUndefined( pollTime ) ? 0 : pollTime;
	if ( this._allReady() === true ) {
		this.loaded = true;
		this.app.pluginsLoaded();
	} else if ( pollTime >= this.preloadThreshold ) {
		this._pollTimeExceeded();
	} else {
		pollTime += 50;
		setTimeout( this._pollLoadingPlugins.bind( this, pollTime ), 50 );
	}
};

/**
 * Checks if all registered plugins have finished loading
 *
 * @returns {boolean} Whether or not all registered plugins are loaded.
 * @private
 */
Pluggable.prototype._allReady = function() {
	return reduce( this.plugins, function( allReady, plugin ) {
		return allReady && plugin.status === "ready";
	}, true );
};

/**
 * Removes the plugins that were not loaded within time and calls `pluginsLoaded` on the app.
 *
 * @returns {void}
 * @private
 */
Pluggable.prototype._pollTimeExceeded = function() {
	forEach( this.plugins, function( plugin, pluginName ) {
		if ( !isUndefined( plugin.options ) && plugin.options.status !== "ready" ) {
			console.error( "Error: Plugin " + pluginName + ". did not finish loading in time." );
			delete this.plugins[ pluginName ];
		}
	} );
	this.loaded = true;
	this.app.pluginsLoaded();
};

/**
 * Calls the callables added to a modification hook. See the YoastSEO.js Readme for a list of supported modification hooks.
 *
 * @param	{string}    modification	The name of the filter
 * @param   {*}         data 		    The data to filter
 * @param   {*}         context		    (optional) Object for passing context parameters to the callable.
 * @returns {*} 		                The filtered data
 * @private
 */
Pluggable.prototype._applyModifications = function( modification, data, context ) {
	var callChain = this.modifications[ modification ];

	if ( callChain instanceof Array && callChain.length > 0 ) {
		callChain = this._stripIllegalModifications( callChain );

		callChain.sort( function( a, b ) {
			return a.priority - b.priority;
		} );
		forEach( callChain, function( callableObject ) {
			var callable = callableObject.callable;
			var newData = callable( data, context );
			if ( typeof newData === typeof data ) {
				data = newData;
			} else {
				console.error( "Modification with name " + modification + " performed by plugin with name " +
				callableObject.origin +
				" was ignored because the data that was returned by it was of a different type than the data we had passed it." );
			}
		} );
	}
	return data;

};

/**
 * Adds new tests to the analyzer and it's scoring object.
 *
 * @param {YoastSEO.Analyzer} analyzer The analyzer object to add the tests to
 * @returns {void}
 * @private
 */
Pluggable.prototype._addPluginTests = function( analyzer ) {
	this.customTests.map( function( customTest ) {
		this._addPluginTest( analyzer, customTest );
	}, this );
};

/**
 * Adds one new test to the analyzer and it's scoring object.
 *
 * @param {YoastSEO.Analyzer} analyzer              The analyzer that the test will be added to.
 * @param {Object}            pluginTest            The test to be added.
 * @param {string}            pluginTest.name       The name of the test.
 * @param {function}          pluginTest.callable   The function associated with the test.
 * @param {function}          pluginTest.analysis   The function associated with the analyzer.
 * @param {Object}            pluginTest.scoring    The scoring object to be used.
 * @returns {void}
 * @private
 */
Pluggable.prototype._addPluginTest = function( analyzer, pluginTest ) {
	analyzer.addAnalysis( {
		"name": pluginTest.name,
		"callable": pluginTest.analysis
	} );

	analyzer.analyzeScorer.addScoring( {
		"name": pluginTest.name,
		"scoring": pluginTest.scoring
	} );
};

/**
 * Strips modifications from a callChain if they were not added with a valid origin.
 *
 * @param   {Array} callChain	 The callChain that contains items with possible invalid origins.
 * @returns {Array} callChain 	 The stripped version of the callChain.
 * @private
 */
Pluggable.prototype._stripIllegalModifications = function( callChain ) {
	forEach( callChain, function( callableObject, index ) {
		if ( this._validateOrigin( callableObject.origin ) === false ) {
			delete callChain[ index ];
		}
	}.bind( this ) );

	return callChain;
};

/**
 * Validates if origin of a modification has been registered and finished preloading.
 *
 * @param 	{string}    pluginName      The name of the plugin that needs to be validated.
 * @returns {boolean}                   Whether or not the origin is valid.
 * @private
 */
Pluggable.prototype._validateOrigin = function( pluginName ) {
	if ( this.plugins[ pluginName ].status !== "ready" ) {
		return false;
	}
	return true;
};

/**
 * Validates if registered plugin has a unique name.
 *
 * @param 	{string}    pluginName      The name of the plugin that needs to be validated for uniqueness.
 * @returns {boolean}                   Whether or not the plugin has a unique name.
 * @private
 */
Pluggable.prototype._validateUniqueness = function( pluginName ) {
	if ( !isUndefined( this.plugins[ pluginName ] ) ) {
		return false;
	}
	return true;
};

module.exports = Pluggable;

},{"./errors/invalidType":41,"lodash/forEach":292,"lodash/isObject":309,"lodash/isString":312,"lodash/isUndefined":315,"lodash/reduce":326}],56:[function(require,module,exports){
/* jshint browser: true */

var forEach = require( "lodash/forEach" );
var isNumber = require( "lodash/isNumber" );
var isObject = require( "lodash/isObject" );
var isUndefined = require( "lodash/isUndefined" );
var difference = require( "lodash/difference" );
var template = require( "../templates.js" ).assessmentPresenterResult;
var scoreToRating = require( "../interpreters/scoreToRating.js" );
var createConfig = require( "../config/presenter.js" );

var domManipulation = require( "../helpers/domManipulation.js" );

/**
 * Constructs the AssessorPresenter.
 *
 * @param {Object} args A list of arguments to use in the presenter.
 * @param {object} args.targets The HTML elements to render the output to.
 * @param {string} args.targets.output The HTML element to render the individual ratings out to.
 * @param {string} args.targets.overall The HTML element to render the overall rating out to.
 * @param {string} args.keyword The keyword to use for checking, when calculating the overall rating.
 * @param {SEOAssessor} args.assessor The Assessor object to retrieve assessment results from.
 * @param {Jed} args.i18n The translation object.
 *
 * @constructor
 */
var AssessorPresenter = function( args ) {
	this.keyword = args.keyword;
	this.assessor = args.assessor;
	this.i18n = args.i18n;
	this.output = args.targets.output;
	this.overall = args.targets.overall || "overallScore";
	this.presenterConfig = createConfig( args.i18n );
};

/**
 * Sets the keyword
 * @param {string} keyword The keyword to use.
 */
AssessorPresenter.prototype.setKeyword = function( keyword ) {
	this.keyword = keyword;
};

/**
 * Checks whether or not a specific property exists in the presenter configuration.
 * @param {string} property The property name to search for.
 * @returns {boolean} Whether or not the property exists.
 */
AssessorPresenter.prototype.configHasProperty = function( property ) {
	return this.presenterConfig.hasOwnProperty( property );
};

/**
 * Gets a fully formatted indicator object that can be used.
 * @param {string} rating The rating to use.
 * @returns {Object} An object containing the class, the screen reader text, and the full text.
 */
AssessorPresenter.prototype.getIndicator = function( rating ) {
	return {
		className: this.getIndicatorColorClass( rating ),
		screenReaderText: this.getIndicatorScreenReaderText( rating ),
		fullText: this.getIndicatorFullText( rating )
	};
};

/**
 * Gets the indicator color class from the presenter configuration, if it exists.
 * @param {string} rating The rating to check against the config.
 * @returns {string} String containing the CSS class to be used.
 */
AssessorPresenter.prototype.getIndicatorColorClass = function( rating ) {
	if ( !this.configHasProperty( rating ) ) {
		return "";
	}

	return this.presenterConfig[ rating ].className;
};

/**
 * Get the indicator screen reader text from the presenter configuration, if it exists.
 * @param {string} rating The rating to check against the config.
 * @returns {string} Translated string containing the screen reader text to be used.
 */
AssessorPresenter.prototype.getIndicatorScreenReaderText = function( rating ) {
	if ( !this.configHasProperty( rating ) ) {
		return "";
	}

	return this.presenterConfig[ rating ].screenReaderText;
};

/**
 * Get the indicator full text from the presenter configuration, if it exists.
 * @param {string} rating The rating to check against the config.
 * @returns {string} Translated string containing the full text to be used.
 */
AssessorPresenter.prototype.getIndicatorFullText = function( rating ) {
	if ( !this.configHasProperty( rating ) ) {
		return "";
	}

	return this.presenterConfig[ rating ].fullText;
};

/**
 * Adds a rating based on the numeric score.
 * @param {Object} result Object based on the Assessment result. Requires a score property to work.
 * @returns {Object} The Assessment result object with the rating added.
 */
AssessorPresenter.prototype.resultToRating = function( result ) {
	if ( !isObject( result ) ) {
		return "";
	}

	result.rating = scoreToRating( result.score );

	return result;
};

/**
 * Takes the individual assessment results, sorts and rates them.
 * @returns {Object} Object containing all the individual ratings.
 */
AssessorPresenter.prototype.getIndividualRatings = function() {
	var ratings = {};
	var validResults = this.sort( this.assessor.getValidResults() );
	var mappedResults = validResults.map( this.resultToRating );

	forEach( mappedResults, function( item, key ) {
		ratings[ key ] = this.addRating( item );
	}.bind( this ) );

	return ratings;
};

/**
 * Excludes items from the results that are present in the exclude array.
 * @param {Array} results Array containing the items to filter through.
 * @param {Array} exclude Array of results to exclude.
 * @returns {Array} Array containing items that remain after exclusion.
 */
AssessorPresenter.prototype.excludeFromResults = function( results, exclude ) {
	return difference( results, exclude );
};

/**
 * Sorts results based on their score property and always places items considered to be unsortable, at the top.
 * @param {Array} results Array containing the results that need to be sorted.
 * @returns {Array} Array containing the sorted results.
 */
AssessorPresenter.prototype.sort = function ( results ) {
	var unsortables = this.getUndefinedScores( results );
	var sortables = this.excludeFromResults( results, unsortables );

	sortables.sort( function( a, b ) {
		return a.score - b.score;
	} );

	return unsortables.concat( sortables );
};

/**
 * Returns a subset of results that have an undefined score or a score set to zero.
 * @param {Array} results The results to filter through.
 * @returns {Array} A subset of results containing items with an undefined score or where the score is zero.
 */
AssessorPresenter.prototype.getUndefinedScores = function ( results ) {
	return results.filter( function( result ) {
		return isUndefined( result.score ) || result.score === 0;
	} );
};

/**
 * Creates a rating object based on the item that is being passed.
 * @param {AssessmentResult} item The item to check and create a rating object from.
 * @returns {Object} Object containing a parsed item, including a colored indicator.
 */
AssessorPresenter.prototype.addRating = function( item ) {
	var indicator = this.getIndicator( item.rating );
	indicator.text = item.text;
	indicator.identifier = item.getIdentifier();

	if ( item.hasMarker() ) {
		indicator.marker = item.getMarker();
	}

	return indicator;
};

/**
 * Calculates the overall rating score based on the overall score.
 * @param {Number} overallScore The overall score to use in the calculation.
 * @returns {Object} The rating based on the score.
 */
AssessorPresenter.prototype.getOverallRating = function( overallScore ) {
	var rating = 0;

	if ( this.keyword === "" ) {
		return this.resultToRating( { score: rating } );
	}

	if ( isNumber( overallScore ) ) {
		rating = ( overallScore / 10 );
	}

	return this.resultToRating( { score: rating } );
};

/**
 * Deactivates all marker buttons to show they are not activated.
 */
AssessorPresenter.prototype.deactiveMarkerClasses = function() {
	var markers = document.getElementsByClassName( "assessment-results__mark" );

	// Reset all other items prior to activating the currently active marker.
	forEach( markers, function( marker ) {
		domManipulation.removeClass( marker, "icon-eye-active" );
		domManipulation.addClass( marker, "icon-eye-inactive" );
	} );
};

/**
 * Toggles the marker button class depending on its state.
 *
 * @param {HTMLElement} element The element to toggle the class on.
 */
AssessorPresenter.prototype.toggleMarkerClass = function( element ) {
	this.deactiveMarkerClasses();

	domManipulation.removeClass( element, "icon-eye-inactive" );
	domManipulation.addClass( element, "icon-eye-active" );
};

/**
 * Adds an event listener for the marker button
 *
 * @param {string} identifier The identifier for the assessment the marker belongs to.
 * @param {Function} marker The marker function that can mark the assessment in the text.
 */
AssessorPresenter.prototype.addMarkerEventHandler = function( identifier, marker ) {
	var container = document.getElementById( this.output );
	var markButton = container.getElementsByClassName( "js-assessment-results__mark-" + identifier )[ 0 ];

	markButton.addEventListener( "click", function( ev ) {
		this.toggleMarkerClass( ev.target );
		marker();
	}.bind( this ) );
};

/**
 * Renders out both the individual and the overall ratings.
 */
AssessorPresenter.prototype.render = function() {
	this.renderIndividualRatings();
	this.renderOverallRating();
};

/**
 * Adds event handlers to the mark buttons
 *
 * @param {Array} scores The list of rendered scores.
 */
AssessorPresenter.prototype.bindMarkButtons = function( scores ) {
	// Make sure the button works for every score with a marker.
	forEach( scores, function ( score ) {
		if ( score.hasOwnProperty( "marker" ) ) {
			this.addMarkerEventHandler( score.identifier, score.marker );
		}
	}.bind( this ) );
};

/**
 * Removes all marks currently on the text
 */
AssessorPresenter.prototype.removeAllMarks = function() {
	var marker = this.assessor.getSpecificMarker();

	marker( this.assessor.getPaper(), [] );
};

/**
 * Adds event handler to remove marks button
 */
AssessorPresenter.prototype.bindRemoveMarksButton = function() {
	var container = document.getElementById( this.output );
	var removeMarksButton = container.getElementsByClassName( "js-assessment-results__remove-marks" )[ 0 ];

	removeMarksButton.addEventListener( "click", function() {
		this.removeAllMarks();
		this.deactiveMarkerClasses();
	}.bind( this ) );
};

/**
 * Renders out the individual ratings.
 */
AssessorPresenter.prototype.renderIndividualRatings = function() {
	var outputTarget = document.getElementById( this.output );
	var scores = this.getIndividualRatings();

	outputTarget.innerHTML = template( {
		scores: scores,
		i18n: {
			markInText: this.i18n.dgettext( "js-text-analysis", "Mark this result in the text" ),
			removeMarks: this.i18n.dgettext( "js-text-analysis", "Remove all marks from the text" )
		}
	} );

	this.bindMarkButtons( scores );
	this.bindRemoveMarksButton();
};

/**
 * Renders out the overall rating.
 */
AssessorPresenter.prototype.renderOverallRating = function() {
	var overallRating = this.getOverallRating( this.assessor.calculateOverallScore() );
	var overallRatingElement = document.getElementById( this.overall );

	if ( !overallRatingElement ) {
		return;
	}

	overallRatingElement.className = "overallScore " + this.getIndicatorColorClass( overallRating.rating );
};

/**
 * Shows the removemarks button when there is something to mark. Otherwise it will hide the button
 *
 * @param {bool} hasMarks When there are marks (true) otherwist it is false.
 */
AssessorPresenter.prototype.displayRemoveAllMarkersButton = function( hasMarks ) {
	var outputElement     = document.getElementById( this.output );
	var removeMarksButton = outputElement.getElementsByClassName( "assessment-results__remove-marks" )[ 0 ];

	if( isUndefined( removeMarksButton ) ) {
		return;
	}

	// Shows the button when there are marks and removes aria-hidden for screenreaders, because element is visible.
	if( hasMarks ) {
		removeMarksButton.style.visibility = "";
		removeMarksButton.removeAttribute( "aria-hidden" );

		return;
	}

	removeMarksButton.style.visibility = "hidden";
	removeMarksButton.setAttribute( "aria-hidden", "true" );
};

module.exports = AssessorPresenter;

},{"../config/presenter.js":33,"../helpers/domManipulation.js":43,"../interpreters/scoreToRating.js":49,"../templates.js":133,"lodash/difference":286,"lodash/forEach":292,"lodash/isNumber":308,"lodash/isObject":309,"lodash/isUndefined":315}],57:[function(require,module,exports){
var merge = require( "lodash/merge" );
var InvalidTypeError = require( "./errors/invalidType" );
var MissingArgument = require( "./errors/missingArgument" );
var isUndefined = require( "lodash/isUndefined" );
var isEmpty = require( "lodash/isEmpty" );

// Researches
var wordCountInText = require( "./researches/wordCountInText.js" );
var getLinkStatistics = require( "./researches/getLinkStatistics.js" );
var linkCount = require( "./researches/countLinks.js" );
var urlLength = require( "./researches/urlIsTooLong.js" );
var findKeywordInPageTitle = require( "./researches/findKeywordInPageTitle.js" );
var matchKeywordInSubheadings = require( "./researches/matchKeywordInSubheadings.js" );
var getKeywordDensity = require( "./researches/getKeywordDensity.js" );
var stopWordsInKeyword = require( "./researches/stopWordsInKeyword" );
var stopWordsInUrl = require( "./researches/stopWordsInUrl" );
var calculateFleschReading = require( "./researches/calculateFleschReading.js" );
var metaDescriptionLength = require( "./researches/metaDescriptionLength.js" );
var imageCount = require( "./researches/imageCountInText.js" );
var altTagCount = require( "./researches/imageAltTags.js" );
var keyphraseLength = require( "./researches/keyphraseLength" );
var metaDescriptionKeyword = require( "./researches/metaDescriptionKeyword.js" );
var keywordCountInUrl = require( "./researches/keywordCountInUrl" );
var findKeywordInFirstParagraph = require( "./researches/findKeywordInFirstParagraph.js" );
var pageTitleLength = require( "./researches/pageTitleLength.js" );
var wordComplexity = require( "./researches/getWordComplexity.js" );
var getParagraphLength = require( "./researches/getParagraphLength.js" );
var countSentencesFromText = require( "./researches/countSentencesFromText.js" );
var countSentencesFromDescription = require( "./researches/countSentencesFromDescription.js" );
var getSubheadingLength = require( "./researches/getSubheadingLength.js" );
var getSubheadingTextLengths = require( "./researches/getSubheadingTextLengths.js" );
var getSubheadingPresence = require( "./researches/getSubheadingPresence.js" );
var findTransitionWords = require( "./researches/findTransitionWords.js" );
var sentenceVariation = require( "./researches/sentenceVariation.js" );
var passiveVoice = require( "./researches/getPassiveVoice.js" );
var getSentenceBeginnings = require( "./researches/getSentenceBeginnings.js" );

/**
 * This contains all possible, default researches.
 * @param {Paper} paper The Paper object that is needed within the researches.
 * @constructor
 * @throws {InvalidTypeError} Parameter needs to be an instance of the Paper object.
 */
var Researcher = function( paper ) {
	this.setPaper( paper );

	this.defaultResearches = {
		"urlLength": urlLength,
		"wordCountInText": wordCountInText,
		"findKeywordInPageTitle": findKeywordInPageTitle,
		"calculateFleschReading": calculateFleschReading,
		"getLinkStatistics": getLinkStatistics,
		"linkCount": linkCount,
		"imageCount": imageCount,
		"altTagCount": altTagCount,
		"matchKeywordInSubheadings": matchKeywordInSubheadings,
		"getKeywordDensity": getKeywordDensity,
		"stopWordsInKeyword": stopWordsInKeyword,
		"stopWordsInUrl": stopWordsInUrl,
		"metaDescriptionLength": metaDescriptionLength,
		"keyphraseLength": keyphraseLength,
		"keywordCountInUrl": keywordCountInUrl,
		"firstParagraph": findKeywordInFirstParagraph,
		"metaDescriptionKeyword": metaDescriptionKeyword,
		"pageTitleLength": pageTitleLength,
		"wordComplexity": wordComplexity,
		"getParagraphLength": getParagraphLength,
		"countSentencesFromText": countSentencesFromText,
		"countSentencesFromDescription": countSentencesFromDescription,
		"getSubheadingLength": getSubheadingLength,
		"getSubheadingTextLengths": getSubheadingTextLengths,
		"getSubheadingPresence": getSubheadingPresence,
		"findTransitionWords": findTransitionWords,
		"sentenceVariation": sentenceVariation,
		"passiveVoice": passiveVoice,
		"getSentenceBeginnings": getSentenceBeginnings
	};

	this.customResearches = {};
};

/**
 * Set the Paper associated with the Researcher.
 * @param {Paper} paper The Paper to use within the Researcher
 * @throws {InvalidTypeError} Parameter needs to be an instance of the Paper object.
 * @returns {void}
 */
Researcher.prototype.setPaper = function( paper ) {
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
Researcher.prototype.addResearch = function( name, research ) {
	if ( isUndefined( name ) || isEmpty( name ) ) {
		throw new MissingArgument( "Research name cannot be empty" );
	}

	if ( !( research instanceof Function ) ) {
		throw new InvalidTypeError( "The research requires a Function callback." );
	}

	this.customResearches[ name ] = research;
};

/**
 * Check wheter or not the research is known by the Researcher.
 * @param {string} name The name to reference the research by.
 * @returns {boolean} Whether or not the research is known by the Researcher
 */
Researcher.prototype.hasResearch = function( name ) {
	return Object.keys( this.getAvailableResearches() ).filter(
	function( research ) {
		return research === name;
	} ).length > 0;
};

/**
 * Return all available researches.
 * @returns {Object} An object containing all available researches.
 */
Researcher.prototype.getAvailableResearches = function() {
	return merge( this.defaultResearches, this.customResearches );
};

/**
 * Return the Research by name.
 * @param {string} name The name to reference the research by.
 * @returns {*} Returns the result of the research or false if research does not exist.
 * @throws {MissingArgument} Research name cannot be empty.
 */
Researcher.prototype.getResearch = function( name ) {
	if ( isUndefined( name ) || isEmpty( name ) ) {
		throw new MissingArgument( "Research name cannot be empty" );
	}

	if ( !this.hasResearch( name ) ) {
		return false;
	}

	return this.getAvailableResearches()[ name ]( this.paper );
};

module.exports = Researcher;

},{"./errors/invalidType":41,"./errors/missingArgument":42,"./researches/calculateFleschReading.js":58,"./researches/countLinks.js":59,"./researches/countSentencesFromDescription.js":60,"./researches/countSentencesFromText.js":61,"./researches/findKeywordInFirstParagraph.js":62,"./researches/findKeywordInPageTitle.js":63,"./researches/findTransitionWords.js":64,"./researches/getKeywordDensity.js":65,"./researches/getLinkStatistics.js":66,"./researches/getParagraphLength.js":68,"./researches/getPassiveVoice.js":69,"./researches/getSentenceBeginnings.js":70,"./researches/getSubheadingLength.js":71,"./researches/getSubheadingPresence.js":72,"./researches/getSubheadingTextLengths.js":73,"./researches/getWordComplexity.js":74,"./researches/imageAltTags.js":75,"./researches/imageCountInText.js":76,"./researches/keyphraseLength":77,"./researches/keywordCountInUrl":78,"./researches/matchKeywordInSubheadings.js":79,"./researches/metaDescriptionKeyword.js":80,"./researches/metaDescriptionLength.js":81,"./researches/pageTitleLength.js":82,"./researches/sentenceVariation.js":88,"./researches/stopWordsInKeyword":89,"./researches/stopWordsInUrl":91,"./researches/urlIsTooLong.js":92,"./researches/wordCountInText.js":93,"lodash/isEmpty":304,"lodash/isUndefined":315,"lodash/merge":320}],58:[function(require,module,exports){
/** @module analyses/calculateFleschReading */

var cleanText = require( "../stringProcessing/cleanText.js" );
var stripNumbers = require( "../stringProcessing/stripNumbers.js" );
var stripHTMLTags = require( "../stringProcessing/stripHTMLTags.js" );
var countSentences = require( "../stringProcessing/countSentences.js" );
var countWords = require( "../stringProcessing/countWords.js" );
var countSyllables = require( "../stringProcessing/countSyllables.js" );
var formatNumber = require( "../helpers/formatNumber.js" );

/**
 * This calculates the fleschreadingscore for a given text
 * The formula used:
 * 206.835 - 1.015 (total words / total sentences) - 84.6 ( total syllables / total words);
 *
 * @param {object} paper The paper containing the text
 * @returns {number} the score of the fleschreading test
 */
module.exports = function( paper ) {
	var text = paper.getText();
	if ( text === "" ) {
		return 0;
	}

	var sentenceCount = countSentences( text );

	text = cleanText( text );
	text = stripHTMLTags( text );
	var wordCount = countWords( text );

	// Prevent division by zero errors.
	if ( sentenceCount === 0 || wordCount === 0 ) {
		return 0;
	}

	text = stripNumbers( text );
	var syllableCount = countSyllables( text );

	var score = 206.835 - ( 1.015 * ( wordCount / sentenceCount ) ) - ( 84.6 * ( syllableCount / wordCount ) );

	return formatNumber( score );
};

},{"../helpers/formatNumber.js":45,"../stringProcessing/cleanText.js":98,"../stringProcessing/countSentences.js":99,"../stringProcessing/countSyllables.js":100,"../stringProcessing/countWords.js":101,"../stringProcessing/stripHTMLTags.js":126,"../stringProcessing/stripNumbers.js":128}],59:[function(require,module,exports){
/** @module analyses/getLinkStatistics */

var getLinks = require( "./getLinks" );

/**
 * Checks a text for anchors and returns the number found.
 *
 * @param {object} paper The paper object containing text, keyword and url.
 * @returns {number} The number of links found in the text.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var anchors = getLinks( text );

	return anchors.length;
};

},{"./getLinks":67}],60:[function(require,module,exports){
var getSentences = require( "../stringProcessing/getSentences" );
var sentencesLength = require( "./../stringProcessing/sentencesLength.js" );

/**
 * Counts sentences in the description..
 * @param {Paper} paper The Paper object to get description from.
 * @returns {Array} The sentences from the text.
 */
module.exports = function( paper ) {
	var sentences = getSentences( paper.getDescription() );
	return sentencesLength( sentences );
};

},{"../stringProcessing/getSentences":108,"./../stringProcessing/sentencesLength.js":124}],61:[function(require,module,exports){
var getSentences = require( "../stringProcessing/getSentences" );
var sentencesLength = require( "./../stringProcessing/sentencesLength.js" );

/**
 * Count sentences in the text.
 * @param {Paper} paper The Paper object to get text from.
 * @returns {Array} The sentences from the text.
 */
module.exports = function( paper ) {
	var sentences = getSentences( paper.getText() );
	return sentencesLength( sentences );
};

},{"../stringProcessing/getSentences":108,"./../stringProcessing/sentencesLength.js":124}],62:[function(require,module,exports){
/** @module analyses/findKeywordInFirstParagraph */

var matchParagraphs = require( "../stringProcessing/matchParagraphs.js" );
var wordMatch = require( "../stringProcessing/matchTextWithWord.js" );

/**
 * Counts the occurrences of the keyword in the first paragraph, returns 0 if it is not found,
 * if there is no paragraph tag or 0 hits, it checks for 2 newlines, otherwise returns the keyword
 * count of the complete text.
 *
 * @param {Paper} paper The text to check for paragraphs.
 * @returns {number} The number of occurences of the keyword in the first paragraph.
 */
module.exports = function( paper ) {
	var paragraph = matchParagraphs( paper.getText() );
	return wordMatch( paragraph[ 0 ], paper.getKeyword(), paper.getLocale() );
};

},{"../stringProcessing/matchParagraphs.js":113,"../stringProcessing/matchTextWithWord.js":116}],63:[function(require,module,exports){
/** @module analyses/findKeywordInPageTitle */

var wordMatch = require( "../stringProcessing/matchTextWithWord.js" );

/**
 * Counts the occurrences of the keyword in the pagetitle. Returns the number of matches
 * and the position of the keyword.
 *
 * @param {object} paper The paper containing title and keyword.
 * @returns {object} result with the matches and position.
 */

module.exports = function( paper ) {
	var title = paper.getTitle();
	var keyword = paper.getKeyword();
	var locale = paper.getLocale();
	var result = { matches: 0, position: -1 };
	result.matches = wordMatch( title, keyword, locale );
	result.position = title.toLocaleLowerCase().indexOf( keyword );

	return result;
};

},{"../stringProcessing/matchTextWithWord.js":116}],64:[function(require,module,exports){
var transitionWords = require( "../config/transitionWords.js" );
var twoPartTransitionWords = require( "../config/twoPartTransitionWords.js" );
var createRegexFromDoubleArray = require( "../stringProcessing/createRegexFromDoubleArray.js" );
var getSentences = require( "../stringProcessing/getSentences.js" );
var matchWordInSentence = require( "../stringProcessing/matchWordInSentence.js" );
var normalizeSingleQuotes = require( "../stringProcessing/quotes.js" ).normalizeSingle;

var forEach = require( "lodash/forEach" );
var filter = require( "lodash/filter" );

var twoPartTransitionWordsRegex = createRegexFromDoubleArray( twoPartTransitionWords() );

/**
 * Matches the sentence against two part transition words.
 *
 * @param {string} sentence The sentence to match against.
 * @returns {Array} The found transitional words.
 */
var matchTwoPartTransitionWords = function( sentence ) {
	sentence = normalizeSingleQuotes( sentence );

	return sentence.match( twoPartTransitionWordsRegex );
};

/**
 * Matches the sentence against transition words.
 *
 * @param {string} sentence The sentence to match against.
 * @returns {Array} The found transitional words.
 */
var matchTransitionWords = function( sentence ) {
	sentence = normalizeSingleQuotes( sentence );

	var matchedTransitionWords = filter( transitionWords(), function( word ) {
		return matchWordInSentence( word, sentence );
	} );

	return matchedTransitionWords;
};

/**
 * Checks the passed sentences to see if they contain transitional words.
 *
 * @param {Array} sentences The sentences to match against.
 * @returns {Array} Array of sentence objects containing the complete sentence and the transitional words.
 */
var checkSentencesForTransitionWords = function( sentences ) {
	var results = [];

	forEach( sentences, function( sentence ) {
		var twoPartMatches = matchTwoPartTransitionWords( sentence );

		if ( twoPartMatches !== null ) {
			results.push( {
				sentence: sentence,
				transitionWords: twoPartMatches
			} );

			return;
		}

		var transitionWordMatches = matchTransitionWords( sentence );

		if ( transitionWordMatches.length !== 0 ) {
			results.push( {
				sentence: sentence,
				transitionWords: transitionWordMatches
			} );

			return;
		}
	} );

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
module.exports = function( paper ) {
	var sentences = getSentences( paper.getText() );
	var sentenceResults = checkSentencesForTransitionWords( sentences );

	return {
		totalSentences: sentences.length,
		sentenceResults: sentenceResults,
		transitionWordSentences: sentenceResults.length
	};
};

},{"../config/transitionWords.js":37,"../config/twoPartTransitionWords.js":39,"../stringProcessing/createRegexFromDoubleArray.js":103,"../stringProcessing/getSentences.js":108,"../stringProcessing/matchWordInSentence.js":117,"../stringProcessing/quotes.js":118,"lodash/filter":288,"lodash/forEach":292}],65:[function(require,module,exports){
/** @module analyses/getKeywordDensity */

var countWords = require( "../stringProcessing/countWords.js" );
var matchWords = require( "../stringProcessing/matchTextWithWord.js" );

/**
 * Calculates the keyword density .
 *
 * @param {object} paper The paper containing keyword and text.
  * @returns {number} The keyword density.
 */
module.exports = function( paper ) {
	var keyword = paper.getKeyword();
	var text = paper.getText();
	var locale = paper.getLocale();
	var wordCount = countWords( text );
	if ( wordCount === 0 ) {
		return 0;
	}
	var keywordCount = matchWords( text, keyword, locale );
	return ( keywordCount / wordCount ) * 100;
};

},{"../stringProcessing/countWords.js":101,"../stringProcessing/matchTextWithWord.js":116}],66:[function(require,module,exports){
/** @module analyses/getLinkStatistics */

var getLinks = require( "./getLinks.js" );
var findKeywordInUrl = require( "../stringProcessing/findKeywordInUrl.js" );
var getLinkType = require( "../stringProcessing/getLinkType.js" );
var checkNofollow = require( "../stringProcessing/checkNofollow.js" );

/**
 * Checks whether or not an anchor contains the passed keyword.
 * @param {string} keyword The keyword to look for.
 * @param {string} anchor The anchor to check against.
 * @param {string} locale The locale used for transliteration.
 * @returns {boolean} Whether or not the keyword was found.
 */
var keywordInAnchor = function( keyword, anchor, locale ) {
	if ( keyword === "" ) {
		return false;
	}

	return findKeywordInUrl( anchor, keyword, locale );
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
var countLinkTypes = function( paper ) {
	var url = paper.getUrl();
	var keyword = paper.getKeyword();
	var locale = paper.getLocale();
	var anchors = getLinks( paper.getText() );

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

	for ( var i = 0; i < anchors.length; i++ ) {
		var currentAnchor = anchors[ i ];

		if ( keywordInAnchor( keyword, currentAnchor, locale ) ) {

			linkCount.keyword.totalKeyword++;
			linkCount.keyword.matchedAnchors.push( currentAnchor );
		}

		var linkType = getLinkType( currentAnchor, url );
		var linkFollow = checkNofollow( currentAnchor );

		linkCount[ linkType + "Total" ]++;
		linkCount[ linkType + linkFollow ]++;
	}

	return linkCount;
};

/**
 * Checks a text for anchors and returns an object with all linktypes found.
 *
 * @param {Paper} paper The paper object containing text, keyword and url.
 * @returns {Object} The object containing all linktypes.
 */
module.exports = function( paper ) {
	return countLinkTypes( paper );
};

},{"../stringProcessing/checkNofollow.js":97,"../stringProcessing/findKeywordInUrl.js":104,"../stringProcessing/getLinkType.js":107,"./getLinks.js":67}],67:[function(require,module,exports){
/** @module analyses/getLinkStatistics */

var getAnchors = require( "../stringProcessing/getAnchorsFromText.js" );

/**
 * Checks a text for anchors and returns the number found.
 *
 * @param {Object} text The text
 * @returns {Array} An array with the anchors
 */
module.exports = function( text ) {
	return getAnchors( text );
};

},{"../stringProcessing/getAnchorsFromText.js":106}],68:[function(require,module,exports){
var countWords = require( "../stringProcessing/countWords.js" );
var matchParagraphs = require( "../stringProcessing/matchParagraphs.js" );
var filter = require( "lodash/filter" );

/**
 * Gets all paragraphs and their word counts from the text.
 *
 * @param {Paper} paper The paper object to get the text from.
 * @returns {Array} The array containing an object with the paragraph word count and paragraph text.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var paragraphs = matchParagraphs( text );
	var paragraphsLength = [];
	paragraphs.map( function ( paragraph ) {
		paragraphsLength.push( {
			wordCount: countWords( paragraph ),
			paragraph: paragraph
		} );
	} );

	return filter( paragraphsLength, function ( paragraphLength ) {
		return ( paragraphLength.wordCount > 0 );
	} );
};

},{"../stringProcessing/countWords.js":101,"../stringProcessing/matchParagraphs.js":113,"lodash/filter":288}],69:[function(require,module,exports){
var getSentences = require( "../stringProcessing/getSentences.js" );
var arrayToRegex = require( "../stringProcessing/createRegexFromArray.js" );
var stripSpaces = require( "../stringProcessing/stripSpaces.js" );
var matchWordInSentence = require( "../stringProcessing/matchWordInSentence.js" );
var normalizeSingleQuotes = require( "../stringProcessing/quotes.js" ).normalizeSingle;

var nonverbEndingEd = require( "./passivevoice-english/non-verb-ending-ed.js" )();
var determiners = require( "./passivevoice-english/determiners.js" )();

var auxiliaries = require( "./passivevoice-english/auxiliaries.js" )();
var irregulars = require( "./passivevoice-english/irregulars.js" )();
var stopwords = require( "./passivevoice-english/stopwords.js" )();

var filter = require( "lodash/filter" );
var isUndefined = require( "lodash/isUndefined" );
var forEach = require( "lodash/forEach" );
var includes = require( "lodash/includes" );

var auxiliaryRegex = arrayToRegex( auxiliaries );
var verbEndingInIngRegex = /\w+ing($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig;
var regularVerbsRegex = /\w+ed($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig;

var ingExclusionArray = [ "king", "cling", "ring", "being" ];
var irregularExclusionArray = [ "get", "gets", "getting", "got", "gotten" ];

/**
 * Matches string with an array, returns the word and the index it was found on.
 *
 * @param {string} sentence The sentence to match the strings from the array to.
 * @param {Array} matches The array with strings to match.
 * @returns {Array} The array with matches, containing the index of the match and the matched string.
 * Returns an empty array if none are found.
 */
var matchArray = function( sentence, matches ) {
	var matchedParts = [];

	forEach( matches, function( part ) {
		part = stripSpaces( part );

		if ( !matchWordInSentence( part, sentence ) ) {
			return;
		}

		matchedParts.push( { index: sentence.indexOf( part ), match: part } );
	} );

	return matchedParts;
};

/**
 * Sorts the array on the index property of each entry.
 *
 * @param {Array} indices The array with indices.
 * @returns {Array} The sorted array with indices.
 */
var sortIndices = function( indices ) {
	return indices.sort( function( a, b ) {
		return ( a.index > b.index );
	} );
};

/**
 * Filters duplicate entries if the indices overlap.
 *
 * @param {Array} indices The array with indices to be filtered.
 * @returns {Array} The filtered array.
 */
var filterIndices = function( indices ) {
	indices = sortIndices( indices );
	for ( var i = 0; i < indices.length; i++ ) {

		// If the next index is within the range of the current index and the length of the word, remove it
		// This makes sure we don't match combinations twice, like "even though" and "though".
		if ( !isUndefined( indices[ i + 1 ] ) && indices[ i + 1 ].index < indices[ i ].index + indices[ i ].match.length ) {
			indices.pop( i + 1 );
		}
	}
	return indices;
};

/**
 * Gets active verbs (ending in ing) to determine sentence breakers.
 *
 * @param {string} sentence The sentence to get the active verbs from.
 * @returns {Array} The array with valid matches.
 */
var getVerbsEndingInIng = function( sentence ) {

	// Matches the sentences with words ending in ing
	var matches = sentence.match( verbEndingInIngRegex ) || [];

	// Filters out words ending in -ing that aren't verbs.
	return filter( matches, function( match ) {
		return !includes( ingExclusionArray, stripSpaces( match ) );
	} );
};

/**
 * Gets the indexes of sentence breakers (auxiliaries, stopwords and active verbs) to determine subsentences.
 * Stopwords are filtered because they can contain duplicate matches, like "even though" and "though".
 *
 * @param {string} sentence The sentence to check for indices of auxiliaries, stopwords and active verbs.
 * @returns {Array} The array with valid indices to use for determining subsentences.
 */
var getSentenceBreakers = function( sentence ) {
	sentence = sentence.toLocaleLowerCase();
	var auxiliaryIndices = matchArray( sentence, auxiliaries );

	var stopwordIndices = matchArray( sentence, stopwords );
	stopwordIndices = filterIndices( stopwordIndices );

	var ingVerbs = getVerbsEndingInIng( sentence );
	var ingVerbsIndices = matchArray( sentence, ingVerbs );

	// Concat all indices arrays and sort them.
	var indices = [].concat( auxiliaryIndices, stopwordIndices, ingVerbsIndices );
	return sortIndices( indices );
};

/**
 * Gets the subsentences from a sentence by determining sentence breakers.
 *
 * @param {string} sentence The sentence to split up in subsentences.
 * @returns {Array} The array with all subsentences of a sentence that have an auxiliary.
 */
var getSubsentences = function( sentence ) {
	var subSentences = [];

	sentence = normalizeSingleQuotes( sentence );

	// First check if there is an auxiliary word in the sentence
	if( sentence.match( auxiliaryRegex ) !== null ) {
		var indices = getSentenceBreakers( sentence );

		// Get the words after the found auxiliary
		for ( var i = 0; i < indices.length; i++ ) {
			var endIndex = sentence.length;
			if ( !isUndefined( indices[ i + 1 ] ) ) {
				endIndex = indices[ i + 1 ].index;
			}

			// Cut the sentence from the current index to the endIndex (start of next breaker, of end of sentence).
			var subSentence = stripSpaces( sentence.substr( indices[ i ].index, endIndex - indices[ i ].index ) );
			subSentences.push( subSentence );
		}
	}

	// If a subsentence doesn't have an auxiliary, we don't need it, so it can be filtered out.
	subSentences = filter( subSentences, function( subSentence ) {
		return subSentence.match( auxiliaryRegex ) !== null;
	} );

	return subSentences;
};

/**
 * Gets regular passive verbs.
 *
 * @param {string} subSentence The sub sentence to check for passive verbs.
 * @returns {Array} The array with all matched verbs.
 */
var getRegularVerbs = function( subSentence ) {
	// Matches the sentences with words ending in ed
	var matches = subSentence.match( regularVerbsRegex ) || [];

	// Filters out words ending in -ed that aren't verbs.
	return filter( matches, function( match ) {
		return !includes( nonverbEndingEd, stripSpaces( match ) );
	} );
};

/**
 * Loops through a list of words and detects if they are present in the sentence.
 *
 * @param {Array} wordList The list of words to filter through.
 * @param {string} sentence The sentence to check for matches.
 * @returns {Array} A list of detected words.
 */
var filterWordListInSentence = function( wordList, sentence ) {
	return filter( wordList, function( word ) {
		return matchWordInSentence( word, sentence );
	} );
};

/**
 * Checks whether the sentence contains an excluded verb.
 *
 * @param {string} sentence The sentence to check for excluded verbs.
 * @returns {boolean} Whether or not the sentence contains an excluded verb.
 */
var hasExcludedIrregularVerb = function( sentence ) {
	return filterWordListInSentence( irregularExclusionArray, sentence ).length !== 0;
};

/**
 * Gets irregular passive verbs.
 *
 * @param {string} sentence The sentence to check for passive verbs.
 * @returns {Array} The array with all matched verbs.
 */
var getIrregularVerbs = function( sentence ) {
	var irregularVerbs = filterWordListInSentence( irregulars, sentence );

	return filter( irregularVerbs, function( verb ) {
		// If rid is used with get, gets, getting, got or gotten, remove it.
		if ( verb.match !== "rid" ) {
			return true;
		}

		return hasExcludedIrregularVerb( sentence );
	} );
};

/**
 * Matches having with a verb directly following it. If so, it is not passive.
 * @param {string} subSentence The subsentence to check for the word 'having' and a verb
 * @param {Array} verbs The array with verbs to check.
 * @returns {boolean} True if it is an exception, false if it is not.
 */
var isHavingException = function( subSentence, verbs ) {
	// Match having with a verb directly following it. If so it is active.
	var indexOfHaving = subSentence.indexOf( "having" );

	if ( indexOfHaving > -1 ) {
		var verbIndices = matchArray( subSentence, verbs );

		if ( !isUndefined( verbIndices[ 0 ] ) && !isUndefined( verbIndices[ 0 ].index ) ) {
			// 7 is the number of characters of the word 'having' including space.
			return verbIndices[ 0 ].index  <= subSentence.indexOf( "having" ) + 7;
		}
	}
	return false;
};

/**
 * Match the left. If left is preceeded by `a` or `the`, it isn't a verb.
 * @param {string} subSentence The subsentence to check for the word 'having' and a verb
 * @param {Array} verbs The array with verbs to check.
 * @returns {boolean} True if it is an exception, false if it is not.
 */
var isLeftException = function ( subSentence, verbs ) {

	// Matches left with the or a preceeding.
	var matchLeft = subSentence.match( /(the|a)\sleft/ig ) || [];
	return matchLeft.length > 0 && verbs[ 0 ].match === "left";
};

/**
 * If the word 'fit' is preceeded by a determiner, it shouldn't be marked as active.
 * @param {string} subSentence The subsentence to check for the word 'having' and a verb
 * @returns {boolean} True if it is an exception, false if it is not.
 */
var isFitException = function( subSentence ) {
	var indexOfFit = subSentence.indexOf( "fit" );
	if ( indexOfFit > -1 ) {
		var subString = subSentence.substr( 0, indexOfFit );
		var determinerIndices = filterWordListInSentence( determiners, subString );
		return determinerIndices.length > 1;
	}
	return false;
};

/**
 * Gets the exceptions. Some combinations shouldn't be marked as passive, so we need to filter them out.
 * @param {string} subSentence The subsentence to check for exceptions.
 * @param {array} verbs The array of verbs, used to determine exceptions.
 * @returns {boolean} Wether there is an exception or not.
 */
var getExceptions = function( subSentence, verbs ) {
	if ( isHavingException( subSentence, verbs ) ) {
		return true;
	}

	if ( isLeftException( subSentence, verbs ) ) {
		return true;
	}

	if ( isFitException( subSentence ) ) {
		return true;
	}

	return false;
};

/**
 * Checks the subsentence for any passive verb.
 * @param {string} subSentence The subsentence to check for passives.
 * @returns {boolean} True if passive is found, false if no passive is found.
 */
var determinePassives = function( subSentence ) {
	subSentence = normalizeSingleQuotes( subSentence );

	var regularVerbs = getRegularVerbs( subSentence );
	var irregularVerbs = getIrregularVerbs( subSentence );
	var verbs = regularVerbs.concat( irregularVerbs );

	// Checks for exceptions in the found verbs.
	var exceptions = getExceptions( subSentence, verbs );

	// If there is any exception, this subsentence cannot be passive.
	return verbs.length > 0 && exceptions === false;
};

/**
 * Determines the number of passive sentences in the text.
 * @param {Paper} paper The paper object to get the text from.
 * @returns {object} The number of passives found in the text and the passive sentences.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var sentences = getSentences( text );
	var passiveSentences = [];

	// Get subsentences for each sentence.
	forEach( sentences, function( sentence ) {
		var subSentences = getSubsentences( sentence );

		var passive = false;
		forEach( subSentences, function( subSentence ) {
			passive = passive || determinePassives( subSentence );
		} );

		if ( passive === true ) {
			passiveSentences.push( sentence );
		}
	} );

	return {
		total: sentences.length,
		passives: passiveSentences
	};
};

},{"../stringProcessing/createRegexFromArray.js":102,"../stringProcessing/getSentences.js":108,"../stringProcessing/matchWordInSentence.js":117,"../stringProcessing/quotes.js":118,"../stringProcessing/stripSpaces.js":129,"./passivevoice-english/auxiliaries.js":83,"./passivevoice-english/determiners.js":84,"./passivevoice-english/irregulars.js":85,"./passivevoice-english/non-verb-ending-ed.js":86,"./passivevoice-english/stopwords.js":87,"lodash/filter":288,"lodash/forEach":292,"lodash/includes":297,"lodash/isUndefined":315}],70:[function(require,module,exports){
var getSentences = require( "../stringProcessing/getSentences.js" );
var getWords = require( "../stringProcessing/getWords.js" );
var stripSpaces = require( "../stringProcessing/stripSpaces.js" );
var removeNonWordCharacters = require( "../stringProcessing/removeNonWordCharacters.js" );
var firstWordExceptions = require ( "../language/en/firstWordExceptions.js" )();

/**
 * Compares the first word of each sentence with the first word of the following sentence.
 * @param {array} sentenceBeginnings The array containing the first word of each sentence.
 * @param {number} i The iterator for the sentenceBeginning array.
 * @returns {boolean} Returns true if sentence beginnings match.
 */
var matchSentenceBeginnings = function( sentenceBeginnings, i ) {
	if ( sentenceBeginnings[ i ] === sentenceBeginnings[ i + 1 ] ) {
		return true;
	}
	return false;
};

/**
 * Counts the number of similar sentence beginnings.
 * @param {array} sentenceBeginnings The array containing the first word of each sentence.
 * @param {array} sentences The array containing all sentences.
 * @returns {array} The array containing the objects containing the first words and the corresponding counts.
 */
var compareFirstWords = function ( sentenceBeginnings, sentences ) {
	var counts = [];
	var foundSentences = [];
	var count = 1;
	for ( var i = 0; i < sentenceBeginnings.length; i++ ) {
		if ( matchSentenceBeginnings( sentenceBeginnings, i ) ) {
			foundSentences.push( sentences[ i ] );
			count++;
		} else {
			foundSentences.push( sentences[ i ] );
			counts.push( { word: sentenceBeginnings[ i ], count: count, sentences: foundSentences } );
			foundSentences = [];
			count = 1;
		}
	}
	return counts;
};

/**
 * Gets the first word of each sentence from the text, and returns an object containing the first word of each sentence and the corresponding counts.
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {Object} The object containing the first word of each sentence and the corresponding counts.
 */
module.exports = function( paper ) {
	var sentences = getSentences( paper.getText() );
	var sentenceBeginnings = sentences.map( function( sentence ) {
		var words = getWords( stripSpaces( sentence ) );
		if( words.length === 0 ) {
			return "";
		}
		var firstWord = removeNonWordCharacters( words[ 0 ] );
		if ( firstWordExceptions.indexOf( firstWord ) > -1 ) {
			firstWord += " " + removeNonWordCharacters( words[ 1 ] );
		}
		return firstWord;
	} );
	return compareFirstWords( sentenceBeginnings, sentences );
};

},{"../language/en/firstWordExceptions.js":50,"../stringProcessing/getSentences.js":108,"../stringProcessing/getWords.js":111,"../stringProcessing/removeNonWordCharacters.js":119,"../stringProcessing/stripSpaces.js":129}],71:[function(require,module,exports){
var getSubheadingContents = require( "../stringProcessing/getSubheadings.js" ).getSubheadingContents;
var stripTags = require( "../stringProcessing/stripHTMLTags.js" );
var forEach = require( "lodash/forEach" );

/**
 * Gets the subheadings from the text and returns the length of these subheading in an array.
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {Array} The array with the length of each subheading.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var matches = getSubheadingContents( text );

	var subHeadings = [];
	forEach( matches, function( subHeading ) {
		subHeading = stripTags( subHeading ).length;
		if ( subHeading > 0 ) {
			subHeadings.push( subHeading );
		}
	} );

	return subHeadings;
};

},{"../stringProcessing/getSubheadings.js":110,"../stringProcessing/stripHTMLTags.js":126,"lodash/forEach":292}],72:[function(require,module,exports){
var getSubheadingsContents = require( "../stringProcessing/getSubheadings.js" ).getSubheadingContents;

/**
 * Checks if there is a subheading present in the text
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {number} Number of headings found.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var headings = getSubheadingsContents( text ) || [];
	return headings.length;
};

},{"../stringProcessing/getSubheadings.js":110}],73:[function(require,module,exports){
var getSubheadingTexts = require( "../stringProcessing/getSubheadingTexts.js" );
var countWords = require( "../stringProcessing/countWords.js" );
var forEach = require( "lodash/forEach" );

/**
 * Gets the subheadings from the text and returns the length of these subheading in an array.
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {Array} The array with the length of each subheading.
 */
module.exports = function( paper ) {
	var text = paper.getText();

	var matches = getSubheadingTexts( text );

	var subHeadingTexts = [];
	forEach( matches, function( subHeading ) {

		subHeadingTexts.push( {
			text: subHeading,
			wordCount: countWords( subHeading )
		} );
	} );
	return subHeadingTexts;
};


},{"../stringProcessing/countWords.js":101,"../stringProcessing/getSubheadingTexts.js":109,"lodash/forEach":292}],74:[function(require,module,exports){
var getWords = require( "../stringProcessing/getWords.js" );
var countSyllables = require( "../stringProcessing/countSyllables.js" );
var getSentences = require( "../stringProcessing/getSentences.js" );

var map = require( "lodash/map" );
var forEach = require( "lodash/forEach" );

/**
 * Gets the complexity per word, along with the index for the sentence.
 * @param {string} sentence The sentence to get wordComplexity from.
 * @returns {Array} A list with words, the index and the complexity per word.
 */
var getWordComplexityForSentence = function( sentence ) {
	var words = getWords( sentence );
	var results = [];

	forEach( words, function( word, i ) {
		results.push( {
			word: word,
			wordIndex: i,
			complexity: countSyllables( word )
		} );
	} );

	return results;
};

/**
 * Calculates the complexity of words in a text, returns each words with their complexity.
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {Object} The words found in the text with the number of syllables.
 */
module.exports = function( paper ) {
	var sentences = getSentences( paper.getText() );

	return map( sentences, function( sentence ) {
		return {
			sentence: sentence,
			words: getWordComplexityForSentence( sentence )
		};
	} );
};


},{"../stringProcessing/countSyllables.js":100,"../stringProcessing/getSentences.js":108,"../stringProcessing/getWords.js":111,"lodash/forEach":292,"lodash/map":318}],75:[function(require,module,exports){
/** @module researches/imageAltTags */

var imageInText = require( "../stringProcessing/imageInText" );
var imageAlttag = require( "../stringProcessing/getAlttagContent" );
var wordMatch = require( "../stringProcessing/matchTextWithWord" );

/**
 * Matches the alt-tags in the images found in the text.
 * Returns an object with the totals and different alt-tags.
 *
 * @param {Array} imageMatches Array with all the matched images in the text
 * @param {string} keyword the keyword to check for.
 * @param {string} locale The locale used for transliteration.
 * @returns {object} altProperties Object with all alt-tags that were found.
 */
var matchAltProperties = function( imageMatches, keyword, locale ) {
	var altProperties = {
		noAlt: 0,
		withAlt: 0,
		withAltKeyword: 0,
		withAltNonKeyword: 0
	};

	for ( var i = 0; i < imageMatches.length; i++ ) {
		var alttag = imageAlttag( imageMatches[ i ] );

		// If no alt-tag is set
		if ( alttag === "" ) {
			altProperties.noAlt++;
			continue;
		}

		// If no keyword is set, but the alt-tag is
		if ( keyword === "" && alttag !== "" ) {
			altProperties.withAlt++;
			continue;
		}

		if ( wordMatch( alttag, keyword, locale ) === 0 && alttag !== "" ) {

			// Match for keywords?
			altProperties.withAltNonKeyword++;
			continue;
		}

		if ( wordMatch( alttag, keyword, locale ) > 0 ) {
			altProperties.withAltKeyword++;
			continue;
		}
	}

	return altProperties;
};

/**
 * Checks the text for images, checks the type of each image and alttags for containing keywords
 *
 * @param {Paper} paper The paper to check for images
 * @returns {object} Object containing all types of found images
 */
module.exports = function( paper ) {
	return matchAltProperties( imageInText( paper.getText() ), paper.getKeyword(), paper.getLocale() );
};

},{"../stringProcessing/getAlttagContent":105,"../stringProcessing/imageInText":112,"../stringProcessing/matchTextWithWord":116}],76:[function(require,module,exports){
/** @module researches/imageInText */

var imageInText = require( "./../stringProcessing/imageInText" );

/**
 * Checks the amount of images in the text.
 *
 * @param {Paper} paper The paper to check for images
 * @returns {number} The amount of found images
 */
module.exports = function( paper ) {
	return imageInText( paper.getText() ).length;
};

},{"./../stringProcessing/imageInText":112}],77:[function(require,module,exports){
var countWords = require( "../stringProcessing/countWords" );
var sanitizeString = require( "../stringProcessing/sanitizeString" );

/**
 * Determines the length in words of a the keyphrase, the keyword is a keyphrase if it is more than one word.
 *
 * @param {Paper} paper The paper to research
 * @returns {number} The length of the keyphrase
 */
function keyphraseLengthResearch( paper ) {
	var keyphrase = sanitizeString( paper.getKeyword() );

	return countWords( keyphrase );
}

module.exports = keyphraseLengthResearch;

},{"../stringProcessing/countWords":101,"../stringProcessing/sanitizeString":123}],78:[function(require,module,exports){
/** @module researches/countKeywordInUrl */

var wordMatch = require( "../stringProcessing/matchTextWithWord.js" );
/**
 * Matches the keyword in the URL. Replaces whitespaces with dashes and uses dash as wordboundary.
 *
 * @param {Paper} paper the Paper object to use in this count.
 * @returns {int} Number of times the keyword is found.
 */
module.exports = function( paper ) {
	var keyword = paper.getKeyword().replace( "'", "" ).replace( /\s/ig, "-" );

	return wordMatch( paper.getUrl(), keyword, paper.getLocale() );
};

},{"../stringProcessing/matchTextWithWord.js":116}],79:[function(require,module,exports){
/* @module analyses/matchKeywordInSubheadings */

var stripSomeTags = require( "../stringProcessing/stripNonTextTags.js" );
var subheadingMatch = require( "../stringProcessing/subheadingsMatch.js" );
var getSubheadingContents = require( "../stringProcessing/getSubheadings.js" ).getSubheadingContents;

/**
 * Checks if there are any subheadings like h2 in the text
 * and if they have the keyword in them.
 *
 * @param {object} paper The paper object containing the text and keyword.
 * @returns {object} the result object.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var keyword = paper.getKeyword();
	var locale = paper.getLocale();
	var result = { count: 0 };
	text = stripSomeTags( text );
	var matches = getSubheadingContents( text );

	if ( 0 !== matches.length ) {
		result.count = matches.length;
		result.matches = subheadingMatch( matches, keyword, locale );
	}

	return result;
};


},{"../stringProcessing/getSubheadings.js":110,"../stringProcessing/stripNonTextTags.js":127,"../stringProcessing/subheadingsMatch.js":130}],80:[function(require,module,exports){
var matchTextWithWord = require( "../stringProcessing/matchTextWithWord.js" );

/**
 * Matches the keyword in the description if a description and keyword are available.
 * default is -1 if no description and/or keyword is specified
 *
 * @param {Paper} paper The paper object containing the description.
 * @returns {number} The number of matches with the keyword
 */
module.exports = function( paper ) {
	if ( paper.getDescription() === "" ) {
		return -1;
	}
	return matchTextWithWord( paper.getDescription(), paper.getKeyword(), paper.getLocale() );
};


},{"../stringProcessing/matchTextWithWord.js":116}],81:[function(require,module,exports){
/**
 * Check the length of the description.
 * @param {Paper} paper The paper object containing the description.
 * @returns {number} The length of the description.
 */
module.exports = function( paper ) {
	return paper.getDescription().length;
};

},{}],82:[function(require,module,exports){
/**
 * Check the length of the title.
 * @param {Paper} paper The paper object containing the title.
 * @returns {number} The length of the title.
 */
module.exports = function( paper ) {
	return paper.getTitle().length;
};

},{}],83:[function(require,module,exports){
module.exports = function() {
	return [
		"am",
		"is",
		"are",
		"was",
		"were",
		"been",
		"being",
		"get",
		"gets",
		"getting",
		"got",
		"gotten",
		"having",
		"be",
		"she's",
		"he's",
		"it's",
		"i'm",
		"we're",
		"they're",
		"you're",
		"what's",
		"isn't",
		"weren't",
		"wasn't",
		"that's",
		"aren't"
	];
};

},{}],84:[function(require,module,exports){
module.exports = function() {
	return [
		"a",
		"an",
		"the",
		"my",
		"her",
		"his",
		"their",
		"its",
		"our",
		"your",
		"am",
		"is",
		"are",
		"was",
		"were",
		"been",
		"being",
		"get",
		"gets",
		"getting",
		"got",
		"gotten",
		"having",
		"be",
		"she's",
		"he's",
		"it's",
		"i'm",
		"we're",
		"they're",
		"you're",
		"what's",
		"isn't",
		"weren't",
		"wasn't",
		"that's",
		"aren't"
	];
};


},{}],85:[function(require,module,exports){
module.exports = function() {
	return [
		"arisen",
		"awoken",
		"reawoken",
		"babysat",
		"backslid",
		"backslidden",
		"beat",
		"beaten",
		"become",
		"begun",
		"bent",
		"unbent",
		"bet",
		"bid",
		"outbid",
		"rebid",
		"underbid",
		"overbid",
		"bidden",
		"bitten",
		"blown",
		"bought",
		"overbought",
		"bound",
		"unbound",
		"rebound",
		"broadcast",
		"rebroadcast",
		"broken",
		"brought",
		"browbeat",
		"browbeaten",
		"built",
		"prebuilt",
		"rebuilt",
		"overbuilt",
		"burnt",
		"burst",
		"bust",
		"cast",
		"miscast",
		"recast",
		"caught",
		"chosen",
		"clung",
		"come",
		"overcome",
		"cost",
		"crept",
		"cut",
		"undercut",
		"recut",
		"daydreamt",
		"dealt",
		"misdealt",
		"redealt",
		"disproven",
		"done",
		"predone",
		"outdone",
		"misdone",
		"redone",
		"overdone",
		"undone",
		"drawn",
		"outdrawn",
		"redrawn",
		"overdrawn",
		"dreamt",
		"driven",
		"outdriven",
		"drunk",
		"outdrunk",
		"overdrunk",
		"dug",
		"dwelt",
		"eaten",
		"overeaten",
		"fallen",
		"felt",
		"fit",
		"refit",
		"retrofit",
		"flown",
		"outflown",
		"flung",
		"forbidden",
		"forecast",
		"foregone",
		"foreseen",
		"foretold",
		"forgiven",
		"forgotten",
		"forsaken",
		"fought",
		"outfought",
		"found",
		"frostbitten",
		"frozen",
		"unfrozen",
		"given",
		"gone",
		"undergone",
//		"got",
		"gotten",
		"ground",
		"reground",
		"grown",
		"outgrown",
		"regrown",
		"had",
		"handwritten",
		"heard",
		"reheard",
		"misheard",
		"overheard",
		"held",
		"hewn",
		"hidden",
		"unhidden",
		"hit",
		"hung",
		"rehung",
		"overhung",
		"unhung",
		"hurt",
		"inlaid",
		"input",
		"interwound",
		"interwoven",
		"jerry-built",
		"kept",
		"knelt",
		"knit",
		"reknit",
		"unknit",
		"known",
		"laid",
		"mislaid",
		"relaid",
		"overlaid",
		"lain",
		"underlain",
		"leant",
		"leapt",
		"outleapt",
		"learnt",
		"unlearnt",
		"relearnt",
		"mislearnt",
		"left",
		"lent",
		"let",
		"lip-read",
		"lit",
		"relit",
		"lost",
		"made",
		"premade",
		"remade",
		"meant",
		"met",
		"mown",
		"offset",
		"paid",
		"prepaid",
		"repaid",
		"overpaid",
		"partaken",
		"proofread",
		"proven",
		"put",
		"quick-frozen",
		"quit",
		"read",
		"misread",
		"reread",
		"retread",
		"rewaken",
		"rid",
		"ridden",
		"outridden",
		"overridden",
		"risen",
		"roughcast",
		"run",
		"outrun",
		"rerun",
		"overrun",
		"rung",
		"said",
		"sand-cast",
		"sat",
		"outsat",
		"sawn",
		"seen",
		"overseen",
		"sent",
		"resent",
		"set",
		"preset",
		"reset",
		"misset",
		"sewn",
		"resewn",
		"oversewn",
		"unsewn",
		"shaken",
		"shat",
		"shaven",
		"shit",
		"shone",
		"outshone",
		"shorn",
		"shot",
		"outshot",
		"overshot",
		"shown",
		"shrunk",
		"preshrunk",
		"shut",
		"sight-read",
		"slain",
		"slept",
		"outslept",
		"overslept",
		"slid",
		"slit",
		"slung",
		"unslung",
		"slunk",
		"smelt",
		"outsmelt",
		"snuck",
		"sold",
		"undersold",
		"presold",
		"outsold",
		"resold",
		"oversold",
		"sought",
		"sown",
		"spat",
		"spelt",
		"misspelt",
		"spent",
		"underspent",
		"outspent",
		"misspent",
		"overspent",
		"spilt",
		"overspilt",
		"spit",
		"split",
		"spoilt",
		"spoken",
		"outspoken",
		"misspoken",
		"overspoken",
		"spread",
		"sprung",
		"spun",
		"unspun",
		"stolen",
		"stood",
		"understood",
		"misunderstood",
		"strewn",
		"stricken",
		"stridden",
		"striven",
		"struck",
		"strung",
		"unstrung",
		"stuck",
		"unstuck",
		"stung",
		"stunk",
		"sublet",
		"sunburnt",
		"sung",
		"outsung",
		"sunk",
		"sweat",
		"swept",
		"swollen",
		"sworn",
		"outsworn",
		"swum",
		"outswum",
		"swung",
		"taken",
		"undertaken",
		"mistaken",
		"retaken",
		"overtaken",
		"taught",
		"mistaught",
		"retaught",
		"telecast",
		"test-driven",
		"test-flown",
		"thought",
		"outthought",
		"rethought",
		"overthought",
		"thrown",
		"outthrown",
		"overthrown",
		"thrust",
		"told",
		"retold",
		"torn",
		"retorn",
		"trod",
		"trodden",
		"typecast",
		"typeset",
		"upheld",
		"upset",
		"waylaid",
		"wept",
		"wet",
		"rewet",
		"withdrawn",
		"withheld",
		"withstood",
		"woken",
		"won",
		"rewon",
		"worn",
		"reworn",
		"wound",
		"rewound",
		"overwound",
		"unwound",
		"woven",
		"rewoven",
		"unwoven",
		"written",
		"typewritten",
		"underwritten",
		"outwritten",
		"miswritten",
		"rewritten",
		"overwritten",
		"wrung"
	];
};

},{}],86:[function(require,module,exports){
module.exports = function() {
	return [
		"ablebodied",
		"abovementioned",
		"absentminded",
		"accoladed",
		"accompanied",
		"acculturized",
		"accursed",
		"acerated",
		"acerbated",
		"acetylized",
		"achromatised",
		"achromatized",
		"acidified",
		"acned",
		"actualised",
		"adrenalised",
		"adulated",
		"adversed",
		"aestheticised",
		"affectioned",
		"affined",
		"affricated",
		"aforementioned",
		"agerelated",
		"aggrieved",
		"airbed",
		"aircooled",
		"airspeed",
		"alcoholized",
		"alcoved",
		"alkalised",
		"allianced",
		"aluminized",
		"alveolated",
		"ambered",
		"ammonified",
		"amplified",
		"anagrammatised",
		"anagrammatized",
		"anathematised",
		"aniseed",
		"ankled",
		"annualized",
		"anonymised",
		"anthologized",
		"antlered",
		"anucleated",
		"anviled",
		"anvilshaped",
		"apostrophised",
		"apostrophized",
		"appliqued",
		"apprized",
		"arbitrated",
		"armored",
		"articled",
		"ashamed",
		"assented",
		"atomised",
		"atrophied",
		"auricled",
		"auriculated",
		"aurified",
		"autopsied",
		"axled",
		"babied",
		"backhoed",
		"badmannered",
		"badtempered",
		"balustered",
		"baned",
		"barcoded",
		"bareboned",
		"barefooted",
		"barelegged",
		"barnacled",
		"bayoneted",
		"beadyeyed",
		"beaked",
		"beaned",
		"beatified",
		"beautified",
		"beavered",
		"bed",
		"bedamned",
		"bedecked",
		"behoved",
		"belated",
		"bellbottomed",
		"bellshaped",
		"benighted",
		"bequeathed",
		"berried",
		"bespectacled",
		"bewhiskered",
		"bighearted",
		"bigmouthed",
		"bigoted",
		"bindweed",
		"binucleated",
		"biopsied",
		"bioturbed",
		"biped",
		"bipinnated",
		"birdfeed",
		"birdseed",
		"bisegmented",
		"bitterhearted",
		"blabbermouthed",
		"blackhearted",
		"bladed",
		"blankminded",
		"blearyeyed",
		"bleed",
		"blissed",
		"blobbed",
		"blondhaired",
		"bloodied",
		"bloodred",
		"bloodshed",
		"blueblooded",
		"boatshaped",
		"bobsled",
		"bodied",
		"boldhearted",
		"boogied",
		"boosed",
		"bosomed",
		"bottlefed",
		"bottlefeed",
		"bottlenecked",
		"bouldered",
		"bowlegged",
		"bowlshaped",
		"brandied",
		"bravehearted",
		"breastfed",
		"breastfeed",
		"breed",
		"brighteyed",
		"brindled",
		"broadhearted",
		"broadleaved",
		"broadminded",
		"brokenhearted",
		"broomed",
		"broomweed",
		"buccaned",
		"buckskinned",
		"bucktoothed",
		"buddied",
		"buffaloed",
		"bugeyed",
		"bugleweed",
		"bugweed",
		"bulletined",
		"bunked",
		"busied",
		"butterfingered",
		"cabbed",
		"caddied",
		"cairned",
		"calcified",
		"canalized",
		"candied",
		"cannulated",
		"canoed",
		"canopied",
		"canvased",
		"caped",
		"capsulated",
		"cassocked",
		"castellated",
		"catabolised",
		"catheterised",
		"caudated",
		"cellmediated",
		"cellulosed",
		"certified",
		"chagrined",
		"chambered",
		"chested",
		"chevroned",
		"chickenfeed",
		"chickenhearted",
		"chickweed",
		"chilblained",
		"childbed",
		"chinned",
		"chromatographed",
		"ciliated",
		"cindered",
		"cingulated",
		"circumstanced",
		"cisgendered",
		"citrullinated",
		"clappered",
		"clarified",
		"classified",
		"clawshaped",
		"claysized",
		"cleanhearted",
		"clearminded",
		"clearsighted",
		"cliched",
		"clodded",
		"cloistered",
		"closefisted",
		"closehearted",
		"closelipped",
		"closemouthed",
		"closeted",
		"cloudseed",
		"clubfooted",
		"clubshaped",
		"clued",
		"cockeyed",
		"codified",
		"coed",
		"coevolved",
		"coffined",
		"coiffed",
		"coinfected",
		"coldblooded",
		"coldhearted",
		"collateralised",
		"colonialised",
		"colorcoded",
		"colorised",
		"colourised",
		"columned",
		"commoditized",
		"compactified",
		"companioned",
		"complexioned",
		"conceited",
		"concerned",
		"concussed",
		"coneshaped",
		"congested",
		"contented",
		"convexed",
		"coralled",
		"corymbed",
		"cottonseed",
		"countrified",
		"countrybred",
		"courtmartialled",
		"coved",
		"coveralled",
		"cowshed",
		"cozied",
		"cragged",
		"crayoned",
		"credentialed",
		"creed",
		"crenulated",
		"crescentshaped",
		"cressweed",
		"crewed",
		"cricked",
		"crispated",
		"crossbarred",
		"crossbed",
		"crossbred",
		"crossbreed",
		"crossclassified",
		"crosseyed",
		"crossfertilised",
		"crossfertilized",
		"crossindexed",
		"crosslegged",
		"crossshaped",
		"crossstratified",
		"crossstriated",
		"crotched",
		"crucified",
		"cruelhearted",
		"crutched",
		"cubeshaped",
		"cubified",
		"cuckolded",
		"cucumbershaped",
		"cumbered",
		"cuminseed",
		"cupshaped",
		"curated",
		"curded",
		"curfewed",
		"curlicued",
		"curlycued",
		"curried",
		"curtsied",
		"cyclized",
		"cylindershaped",
		"damed",
		"dandified",
		"dangered",
		"darkhearted",
		"daybed",
		"daylighted",
		"deacidified",
		"deacylated",
		"deadhearted",
		"deadlined",
		"deaminized",
		"deathbed",
		"decalcified",
		"decertified",
		"deckbed",
		"declassified",
		"declutched",
		"decolourated",
		"decreed",
		"deed",
		"deeprooted",
		"deepseated",
		"defensed",
		"defied",
		"deflexed",
		"deglamorised",
		"degunkified",
		"dehumidified",
		"deified",
		"deled",
		"delegitimised",
		"demoded",
		"demystified",
		"denasalized",
		"denazified",
		"denied",
		"denitrified",
		"denticulated",
		"deseed",
		"desexualised",
		"desposited",
		"detoxified",
		"deuced",
		"devitrified",
		"dewlapped",
		"dezincified",
		"diagonalised",
		"dialogued",
		"died",
		"digitated",
		"dignified",
		"dilled",
		"dimwitted",
		"diphthonged",
		"disaffected",
		"disaggregated",
		"disarrayed",
		"discalced",
		"discolorated",
		"discolourated",
		"discshaped",
		"diseased",
		"disembodied",
		"disencumbered",
		"disfranchised",
		"diskshaped",
		"disproportionated",
		"disproportioned",
		"disqualified",
		"distempered",
		"districted",
		"diversified",
		"diverticulated",
		"divested",
		"divvied",
		"dizzied",
		"dogged",
		"dogsbodied",
		"dogsled",
		"domeshaped",
		"domiciled",
		"dormered",
		"doublebarrelled",
		"doublestranded",
		"doublewalled",
		"downhearted",
		"duckbilled",
		"eared",
		"echeloned",
		"eddied",
		"edified",
		"eggshaped",
		"elasticated",
		"electrified",
		"elegized",
		"embed",
		"embodied",
		"emceed",
		"empaneled",
		"empanelled",
		"emptyhearted",
		"emulsified",
		"engined",
		"ennobled",
		"envied",
		"enzymecatalysed",
		"enzymecatalyzed",
		"epitomised",
		"epoxidized",
		"epoxied",
		"etherised",
		"etherized",
		"evilhearted",
		"evilminded",
		"exceed",
		"exemplified",
		"exponentiated",
		"expurgated",
		"extravasated",
		"extraverted",
		"extroverted",
		"fabled",
		"facelifted",
		"facsimiled",
		"fainthearted",
		"falcated",
		"falsehearted",
		"falsified",
		"famed",
		"fancified",
		"fanged",
		"fanshaped",
		"fantasied",
		"farsighted",
		"fated",
		"fatted",
		"fazed",
		"featherbed",
		"fed",
		"federalized",
		"feeblehearted",
		"feebleminded",
		"feeblewitted",
		"feed",
		"fendered",
		"fenestrated",
		"ferried",
		"fevered",
		"fibered",
		"fibred",
		"ficklehearted",
		"fiercehearted",
		"figged",
		"filigreed",
		"filterfeed",
		"fireweed",
		"firmhearted",
		"fissured",
		"flanged",
		"flanneled",
		"flannelled",
		"flatbed",
		"flatfooted",
		"flatted",
		"flaxenhaired",
		"flaxseed",
		"flaxweed",
		"flighted",
		"floodgenerated",
		"flowerbed",
		"fluidised",
		"fluidized",
		"flurried",
		"fobbed",
		"fonded",
		"forcefeed",
		"foreshortened",
		"foresighted",
		"forkshaped",
		"formfeed",
		"fortified",
		"fortressed",
		"foulmouthed",
		"foureyed",
		"foxtailed",
		"fractionalised",
		"fractionalized",
		"frankhearted",
		"freed",
		"freehearted",
		"freespirited",
		"frenzied",
		"friezed",
		"frontiered",
		"fructified",
		"frumped",
		"fullblooded",
		"fullbodied",
		"fullfledged",
		"fullhearted",
		"funnelshaped",
		"furnaced",
		"gaitered",
		"galleried",
		"gangliated",
		"ganglionated",
		"gangrened",
		"gargoyled",
		"gasified",
		"gaunted",
		"gauntleted",
		"gauzed",
		"gavelled",
		"gelatinised",
		"gemmed",
		"genderized",
		"gentled",
		"gentlehearted",
		"gerrymandered",
		"gladhearted",
		"glamored",
		"globed",
		"gloried",
		"glorified",
		"glycosylated",
		"goateed",
		"gobletshaped",
		"godspeed",
		"goodhearted",
		"goodhumored",
		"goodhumoured",
		"goodnatured",
		"goodtempered",
		"goosed",
		"goosenecked",
		"goutweed",
		"grainfed",
		"grammaticalized",
		"grapeseed",
		"gratified",
		"graved",
		"gravelbed",
		"grayhaired",
		"greathearted",
		"greed",
		"greenweed",
		"grommeted",
		"groundspeed",
		"groved",
		"gruffed",
		"guiled",
		"gulled",
		"gumshoed",
		"gunkholed",
		"gussied",
		"guyed",
		"gyrostabilized",
		"hackneyed",
		"hagged",
		"haired",
		"halfcivilized",
		"halfhearted",
		"halfwitted",
		"haloed",
		"handballed",
		"handfed",
		"handfeed",
		"hardcoded",
		"hardhearted",
		"hardnosed",
		"hared",
		"harelipped",
		"hasted",
		"hatred",
		"haunched",
		"hawkeyed",
		"hayseed",
		"hayweed",
		"hearsed",
		"hearted",
		"heartshaped",
		"heavenlyminded",
		"heavyfooted",
		"heavyhearted",
		"heed",
		"heired",
		"heisted",
		"helicoptered",
		"helmed",
		"helmeted",
		"hemagglutinated",
		"hemolyzed",
		"hempseed",
		"hempweed",
		"heparinised",
		"heparinized",
		"herbed",
		"highheeled",
		"highminded",
		"highpriced",
		"highspeed",
		"highspirited",
		"hilled",
		"hipped",
		"hispanicised",
		"hocked",
		"hoed",
		"hogweed",
		"holstered",
		"homaged",
		"hoodooed",
		"hoofed",
		"hooknosed",
		"hooved",
		"horned",
		"horrified",
		"horseshoed",
		"horseweed",
		"hotbed",
		"hotblooded",
		"hothearted",
		"hotted",
		"hottempered",
		"hued",
		"humansized",
		"humidified",
		"humped",
		"hundred",
		"hutched",
		"hyperinflated",
		"hyperpigmented",
		"hyperstimulated",
		"hypertrophied",
		"hyphened",
		"hypophysectomised",
		"hypophysectomized",
		"hypopigmented",
		"hypostatised",
		"hysterectomized",
		"iconified",
		"iconised",
		"iconized",
		"ideologised",
		"illbred",
		"illconceived",
		"illdefined",
		"illdisposed",
		"illequipped",
		"illfated",
		"illfavored",
		"illfavoured",
		"illflavored",
		"illfurnished",
		"illhumored",
		"illhumoured",
		"illimited",
		"illmannered",
		"illnatured",
		"illomened",
		"illproportioned",
		"illqualified",
		"illscented",
		"illtempered",
		"illumed",
		"illusioned",
		"imbed",
		"imbossed",
		"imbued",
		"immatured",
		"impassioned",
		"impenetrated",
		"imperfected",
		"imperialised",
		"imperturbed",
		"impowered",
		"imputed",
		"inarticulated",
		"inbred",
		"inbreed",
		"incapsulated",
		"incased",
		"incrustated",
		"incrusted",
		"indebted",
		"indeed",
		"indemnified",
		"indentured",
		"indigested",
		"indisposed",
		"inexperienced",
		"infrared",
		"intensified",
		"intentioned",
		"interbedded",
		"interbred",
		"interbreed",
		"interluded",
		"introverted",
		"inured",
		"inventoried",
		"iodinated",
		"iodised",
		"irked",
		"ironfisted",
		"ironweed",
		"itchweed",
		"ivied",
		"ivyweed",
		"jagged",
		"jellified",
		"jerseyed",
		"jetlagged",
		"jetpropelled",
		"jeweled",
		"jewelled",
		"jewelweed",
		"jiggered",
		"jimmyweed",
		"jimsonweed",
		"jointweed",
		"joyweed",
		"jungled",
		"juried",
		"justiceweed",
		"justified",
		"karstified",
		"kerchiefed",
		"kettleshaped",
		"kibbled",
		"kidneyshaped",
		"kimonoed",
		"kindhearted",
		"kindred",
		"kingsized",
		"kirtled",
		"knacked",
		"knapweed",
		"kneed",
		"knobbed",
		"knobweed",
		"knopweed",
		"knotweed",
		"lakebed",
		"lakeweed",
		"lamed",
		"lamellated",
		"lanceshaped",
		"lanceted",
		"landbased",
		"lapeled",
		"lapelled",
		"largehearted",
		"lariated",
		"lased",
		"latticed",
		"lauded",
		"lavaged",
		"lavendered",
		"lawned",
		"led",
		"lefteyed",
		"legitimatised",
		"legitimatized",
		"leisured",
		"lensshaped",
		"leveed",
		"levied",
		"lichened",
		"lichenized",
		"lidded",
		"lifesized",
		"lightfingered",
		"lightfooted",
		"lighthearted",
		"lightminded",
		"lightspeed",
		"lignified",
		"likeminded",
		"lilylivered",
		"limbed",
		"linearised",
		"linearized",
		"linefeed",
		"linseed",
		"lionhearted",
		"liquefied",
		"liquified",
		"lithified",
		"liveried",
		"lobbied",
		"locoweed",
		"longarmed",
		"longhaired",
		"longhorned",
		"longlegged",
		"longnecked",
		"longsighted",
		"longwinded",
		"lopsided",
		"loudmouthed",
		"louvered",
		"louvred",
		"lowbred",
		"lowpriced",
		"lowspirited",
		"lozenged",
		"lunated",
		"lyrated",
		"lysinated",
		"maced",
		"macroaggregated",
		"macrodissected",
		"maculated",
		"madweed",
		"magnified",
		"maidenweed",
		"maladapted",
		"maladjusted",
		"malnourished",
		"malrotated",
		"maned",
		"mannered",
		"manuevered",
		"manyhued",
		"manyshaped",
		"manysided",
		"masted",
		"mealymouthed",
		"meanspirited",
		"membered",
		"membraned",
		"metaled",
		"metalized",
		"metallised",
		"metallized",
		"metamerized",
		"metathesized",
		"meted",
		"methylated",
		"mettled",
		"microbrecciated",
		"microminiaturized",
		"microstratified",
		"middleaged",
		"midsized",
		"miffed",
		"mildhearted",
		"milkweed",
		"miniskirted",
		"misactivated",
		"misaligned",
		"mischiefed",
		"misclassified",
		"misdeed",
		"misdemeaned",
		"mismannered",
		"misnomered",
		"misproportioned",
		"miswired",
		"mitred",
		"mitted",
		"mittened",
		"moneyed",
		"monocled",
		"mononucleated",
		"monospaced",
		"monotoned",
		"monounsaturated",
		"mortified",
		"moseyed",
		"motorised",
		"motorized",
		"moussed",
		"moustached",
		"muddied",
		"mugweed",
		"multiarmed",
		"multibarreled",
		"multibladed",
		"multicelled",
		"multichambered",
		"multichanneled",
		"multichannelled",
		"multicoated",
		"multidirected",
		"multiengined",
		"multifaceted",
		"multilaminated",
		"multilaned",
		"multilayered",
		"multilobed",
		"multilobulated",
		"multinucleated",
		"multipronged",
		"multisegmented",
		"multisided",
		"multispeed",
		"multistemmed",
		"multistoried",
		"multitalented",
		"multitoned",
		"multitowered",
		"multivalued",
		"mummied",
		"mummified",
		"mustached",
		"mustachioed",
		"mutinied",
		"myelinated",
		"mystified",
		"mythicised",
		"naked",
		"narcotised",
		"narrowminded",
		"natured",
		"neaped",
		"nearsighted",
		"necrosed",
		"nectared",
		"need",
		"needleshaped",
		"newfangled",
		"newlywed",
		"nibbed",
		"nimblewitted",
		"nippled",
		"nixed",
		"nobled",
		"noduled",
		"noised",
		"nonaccented",
		"nonactivated",
		"nonadsorbed",
		"nonadulterated",
		"nonaerated",
		"nonaffiliated",
		"nonaliased",
		"nonalienated",
		"nonaligned",
		"nonarchived",
		"nonarmored",
		"nonassociated",
		"nonattenuated",
		"nonblackened",
		"nonbreastfed",
		"nonbrecciated",
		"nonbuffered",
		"nonbuttered",
		"noncarbonated",
		"noncarbonized",
		"noncatalogued",
		"noncatalyzed",
		"noncategorized",
		"noncertified",
		"nonchlorinated",
		"nonciliated",
		"noncircumcised",
		"noncivilized",
		"nonclassified",
		"noncoated",
		"noncodified",
		"noncoerced",
		"noncommercialized",
		"noncommissioned",
		"noncompacted",
		"noncompiled",
		"noncomplicated",
		"noncomposed",
		"noncomputed",
		"noncomputerized",
		"nonconcerted",
		"nonconditioned",
		"nonconfirmed",
		"noncongested",
		"nonconjugated",
		"noncooled",
		"noncorrugated",
		"noncoupled",
		"noncreated",
		"noncrowded",
		"noncultured",
		"noncurated",
		"noncushioned",
		"nondecoded",
		"nondecomposed",
		"nondedicated",
		"nondeferred",
		"nondeflated",
		"nondegenerated",
		"nondegraded",
		"nondelegated",
		"nondelimited",
		"nondelineated",
		"nondemarcated",
		"nondeodorized",
		"nondeployed",
		"nonderivatized",
		"nonderived",
		"nondetached",
		"nondetailed",
		"nondifferentiated",
		"nondigested",
		"nondigitized",
		"nondilapidated",
		"nondilated",
		"nondimensionalised",
		"nondimensionalized",
		"nondirected",
		"nondisabled",
		"nondisciplined",
		"nondispersed",
		"nondisputed",
		"nondisqualified",
		"nondisrupted",
		"nondisseminated",
		"nondissipated",
		"nondissolved",
		"nondistressed",
		"nondistributed",
		"nondiversified",
		"nondiverted",
		"nondocumented",
		"nondomesticated",
		"nondoped",
		"nondrafted",
		"nondrugged",
		"nondubbed",
		"nonducted",
		"nonearthed",
		"noneclipsed",
		"nonedged",
		"nonedited",
		"nonelasticized",
		"nonelectrified",
		"nonelectroplated",
		"nonelectroporated",
		"nonelevated",
		"noneliminated",
		"nonelongated",
		"nonembedded",
		"nonembodied",
		"nonemphasized",
		"nonencapsulated",
		"nonencoded",
		"nonencrypted",
		"nonendangered",
		"nonengraved",
		"nonenlarged",
		"nonenriched",
		"nonentangled",
		"nonentrenched",
		"nonepithelized",
		"nonequilibrated",
		"nonestablished",
		"nonetched",
		"nonethoxylated",
		"nonethylated",
		"nonetiolated",
		"nonexaggerated",
		"nonexcavated",
		"nonexhausted",
		"nonexperienced",
		"nonexpired",
		"nonfabricated",
		"nonfalsified",
		"nonfeathered",
		"nonfeatured",
		"nonfed",
		"nonfederated",
		"nonfeed",
		"nonfenestrated",
		"nonfertilized",
		"nonfilamented",
		"nonfinanced",
		"nonfinished",
		"nonfinned",
		"nonfissured",
		"nonflagellated",
		"nonflagged",
		"nonflared",
		"nonflavored",
		"nonfluidized",
		"nonfluorinated",
		"nonfluted",
		"nonforested",
		"nonformalized",
		"nonformatted",
		"nonfragmented",
		"nonfragranced",
		"nonfranchised",
		"nonfreckled",
		"nonfueled",
		"nonfumigated",
		"nonfunctionalized",
		"nonfunded",
		"nongalvanized",
		"nongated",
		"nongelatinized",
		"nongendered",
		"nongeneralized",
		"nongenerated",
		"nongifted",
		"nonglazed",
		"nonglucosated",
		"nonglucosylated",
		"nonglycerinated",
		"nongraded",
		"nongrounded",
		"nonhalogenated",
		"nonhandicapped",
		"nonhospitalised",
		"nonhospitalized",
		"nonhydrated",
		"nonincorporated",
		"nonindexed",
		"noninfected",
		"noninfested",
		"noninitialized",
		"noninitiated",
		"noninoculated",
		"noninseminated",
		"noninstitutionalized",
		"noninsured",
		"nonintensified",
		"noninterlaced",
		"noninterpreted",
		"nonintroverted",
		"noninvestigated",
		"noninvolved",
		"nonirrigated",
		"nonisolated",
		"nonisomerized",
		"nonissued",
		"nonitalicized",
		"nonitemized",
		"noniterated",
		"nonjaded",
		"nonlabelled",
		"nonlaminated",
		"nonlateralized",
		"nonlayered",
		"nonlegalized",
		"nonlegislated",
		"nonlesioned",
		"nonlexicalized",
		"nonliberated",
		"nonlichenized",
		"nonlighted",
		"nonlignified",
		"nonlimited",
		"nonlinearized",
		"nonlinked",
		"nonlobed",
		"nonlobotomized",
		"nonlocalized",
		"nonlysed",
		"nonmachined",
		"nonmalnourished",
		"nonmandated",
		"nonmarginalized",
		"nonmassaged",
		"nonmatriculated",
		"nonmatted",
		"nonmatured",
		"nonmechanized",
		"nonmedicated",
		"nonmedullated",
		"nonmentioned",
		"nonmetabolized",
		"nonmetallized",
		"nonmetastasized",
		"nonmetered",
		"nonmethoxylated",
		"nonmilled",
		"nonmineralized",
		"nonmirrored",
		"nonmodeled",
		"nonmoderated",
		"nonmodified",
		"nonmonetized",
		"nonmonitored",
		"nonmortgaged",
		"nonmotorized",
		"nonmottled",
		"nonmounted",
		"nonmultithreaded",
		"nonmutilated",
		"nonmyelinated",
		"nonnormalized",
		"nonnucleated",
		"nonobjectified",
		"nonobligated",
		"nonoccupied",
		"nonoiled",
		"nonopinionated",
		"nonoxygenated",
		"nonpaginated",
		"nonpaired",
		"nonparalyzed",
		"nonparameterized",
		"nonparasitized",
		"nonpasteurized",
		"nonpatterned",
		"nonphased",
		"nonphosphatized",
		"nonphosphorized",
		"nonpierced",
		"nonpigmented",
		"nonpiloted",
		"nonpipelined",
		"nonpitted",
		"nonplussed",
		"nonpuffed",
		"nonrandomized",
		"nonrated",
		"nonrefined",
		"nonregistered",
		"nonregulated",
		"nonrelated",
		"nonretarded",
		"nonsacred",
		"nonsalaried",
		"nonsanctioned",
		"nonsaturated",
		"nonscented",
		"nonscheduled",
		"nonseasoned",
		"nonsecluded",
		"nonsegmented",
		"nonsegregated",
		"nonselected",
		"nonsolidified",
		"nonspecialized",
		"nonspored",
		"nonstandardised",
		"nonstandardized",
		"nonstratified",
		"nonstressed",
		"nonstriated",
		"nonstriped",
		"nonstructured",
		"nonstylised",
		"nonstylized",
		"nonsubmerged",
		"nonsubscripted",
		"nonsubsidised",
		"nonsubsidized",
		"nonsubstituted",
		"nonsyndicated",
		"nonsynthesised",
		"nontabulated",
		"nontalented",
		"nonthreaded",
		"nontinted",
		"nontolerated",
		"nontranslated",
		"nontunnelled",
		"nonunified",
		"nonunionised",
		"nonupholstered",
		"nonutilised",
		"nonutilized",
		"nonvalued",
		"nonvaried",
		"nonverbalized",
		"nonvitrified",
		"nonvolatilised",
		"nonvolatilized",
		"normed",
		"nosebleed",
		"notated",
		"notified",
		"nuanced",
		"nullified",
		"numerated",
		"oarweed",
		"objectified",
		"obliqued",
		"obtunded",
		"occupied",
		"octupled",
		"odored",
		"oilseed",
		"oinked",
		"oldfashioned",
		"onesided",
		"oophorectomized",
		"opaqued",
		"openhearted",
		"openminded",
		"openmouthed",
		"opiated",
		"opinionated",
		"oracled",
		"oreweed",
		"ossified",
		"outbreed",
		"outmoded",
		"outrigged",
		"outriggered",
		"outsized",
		"outskated",
		"outspeed",
		"outtopped",
		"outtrumped",
		"outvoiced",
		"outweed",
		"ovated",
		"overadorned",
		"overaged",
		"overalled",
		"overassured",
		"overbred",
		"overbreed",
		"overcomplicated",
		"overdamped",
		"overdetailed",
		"overdiversified",
		"overdyed",
		"overequipped",
		"overfatigued",
		"overfed",
		"overfeed",
		"overindebted",
		"overintensified",
		"overinventoried",
		"overmagnified",
		"overmodified",
		"overpreoccupied",
		"overprivileged",
		"overproportionated",
		"overqualified",
		"overseed",
		"oversexed",
		"oversimplified",
		"oversized",
		"oversophisticated",
		"overstudied",
		"oversulfated",
		"ovicelled",
		"ovoidshaped",
		"ozonated",
		"pacified",
		"packeted",
		"palatalized",
		"paled",
		"palsied",
		"paned",
		"panicled",
		"parabled",
		"parallelepiped",
		"parallelized",
		"parallelopiped",
		"parenthesised",
		"parodied",
		"parqueted",
		"passioned",
		"paunched",
		"pauperised",
		"pedigreed",
		"pedimented",
		"pedunculated",
		"pegged",
		"peglegged",
		"penanced",
		"pencilshaped",
		"permineralized",
		"personified",
		"petrified",
		"photodissociated",
		"photoduplicated",
		"photoed",
		"photoinduced",
		"photolysed",
		"photolyzed",
		"pied",
		"pigeoned",
		"pigtailed",
		"pigweed",
		"pilastered",
		"pillared",
		"pilloried",
		"pimpled",
		"pinealectomised",
		"pinealectomized",
		"pinfeathered",
		"pinnacled",
		"pinstriped",
		"pixellated",
		"pixilated",
		"pixillated",
		"plainclothed",
		"plantarflexed",
		"pled",
		"plumaged",
		"pocked",
		"pokeweed",
		"polychlorinated",
		"polyunsaturated",
		"ponytailed",
		"pooched",
		"poorspirited",
		"popeyed",
		"poppyseed",
		"porcelainized",
		"porched",
		"poshed",
		"pottered",
		"poxed",
		"preachified",
		"precertified",
		"preclassified",
		"preconized",
		"preinoculated",
		"premed",
		"prenotified",
		"preoccupied",
		"preposed",
		"prequalified",
		"preshaped",
		"presignified",
		"prespecified",
		"prettified",
		"pried",
		"principled",
		"proceed",
		"prophesied",
		"propounded",
		"prosed",
		"protonated",
		"proudhearted",
		"proxied",
		"pulpified",
		"pumpkinseed",
		"puppied",
		"purebred",
		"pured",
		"pureed",
		"purified",
		"pustuled",
		"putrefied",
		"pyjamaed",
		"quadruped",
		"qualified",
		"quantified",
		"quantised",
		"quantized",
		"quarried",
		"queried",
		"questoned",
		"quicktempered",
		"quickwitted",
		"quiesced",
		"quietened",
		"quizzified",
		"racemed",
		"radiosensitised",
		"ragweed",
		"raindrenched",
		"ramped",
		"rapeseed",
		"rarefied",
		"rarified",
		"ratified",
		"razoredged",
		"reaccelerated",
		"reaccompanied",
		"reachieved",
		"reacknowledged",
		"readdicted",
		"readied",
		"reamplified",
		"reannealed",
		"reassociated",
		"rebadged",
		"rebiopsied",
		"recabled",
		"recategorised",
		"receipted",
		"recentred",
		"recertified",
		"rechoreographed",
		"reclarified",
		"reclassified",
		"reconferred",
		"recrystalized",
		"rectified",
		"recursed",
		"redblooded",
		"redefied",
		"redenied",
		"rednecked",
		"redshifted",
		"redweed",
		"redyed",
		"reed",
		"reembodied",
		"reenlighted",
		"refeed",
		"refereed",
		"reflexed",
		"refortified",
		"refronted",
		"refuged",
		"reglorified",
		"reimpregnated",
		"reinitialized",
		"rejustified",
		"reliquefied",
		"remedied",
		"remodified",
		"remonetized",
		"remythologized",
		"renotified",
		"renullified",
		"renumerated",
		"reoccupied",
		"repacified",
		"repurified",
		"reputed",
		"requalified",
		"rescinded",
		"reseed",
		"reshoed",
		"resolidified",
		"resorbed",
		"respecified",
		"restudied",
		"retabulated",
		"reticulated",
		"retinted",
		"retreed",
		"retroacted",
		"reunified",
		"reverified",
		"revested",
		"revivified",
		"rewed",
		"ridgepoled",
		"riffled",
		"rightminded",
		"rigidified",
		"rinded",
		"riped",
		"rited",
		"ritualised",
		"riverbed",
		"rivered",
		"roached",
		"roadbed",
		"robotised",
		"robotized",
		"romanized",
		"rosetted",
		"rosined",
		"roughhearted",
		"rubied",
		"ruddied",
		"runcinated",
		"russeted",
		"sabled",
		"sabred",
		"sabretoothed",
		"sacheted",
		"sacred",
		"saddlebred",
		"sainted",
		"salaried",
		"samoyed",
		"sanctified",
		"satellited",
		"savvied",
		"sawtoothed",
		"scandalled",
		"scarified",
		"scarped",
		"sceptred",
		"scissored",
		"screed",
		"screwshaped",
		"scrupled",
		"sculked",
		"scurried",
		"scuttled",
		"seabed",
		"seaweed",
		"seed",
		"seedbed",
		"selfassured",
		"selforganized",
		"semicivilized",
		"semidetached",
		"semidisassembled",
		"semidomesticated",
		"semipetrified",
		"semipronated",
		"semirefined",
		"semivitrified",
		"sentineled",
		"sepaled",
		"sepalled",
		"sequinned",
		"sexed",
		"shagged",
		"shaggycoated",
		"shaggyhaired",
		"shaled",
		"shammed",
		"sharpangled",
		"sharpclawed",
		"sharpcornered",
		"sharpeared",
		"sharpedged",
		"sharpeyed",
		"sharpflavored",
		"sharplimbed",
		"sharpnosed",
		"sharpsighted",
		"sharptailed",
		"sharptongued",
		"sharptoothed",
		"sharpwitted",
		"sharpworded",
		"shed",
		"shellbed",
		"shieldshaped",
		"shimmied",
		"shinned",
		"shirted",
		"shirtsleeved",
		"shoed",
		"shortbeaked",
		"shortbilled",
		"shortbodied",
		"shorthaired",
		"shortlegged",
		"shortlimbed",
		"shortnecked",
		"shortnosed",
		"shortsighted",
		"shortsleeved",
		"shortsnouted",
		"shortstaffed",
		"shorttailed",
		"shorttempered",
		"shorttoed",
		"shorttongued",
		"shortwinded",
		"shortwinged",
		"shotted",
		"shred",
		"shrewsized",
		"shrined",
		"shrinkproofed",
		"sickbed",
		"sickleshaped",
		"sickleweed",
		"signalised",
		"signified",
		"silicified",
		"siliconized",
		"silkweed",
		"siltsized",
		"silvertongued",
		"simpleminded",
		"simplified",
		"singlebarreled",
		"singlebarrelled",
		"singlebed",
		"singlebladed",
		"singlebreasted",
		"singlecelled",
		"singlefooted",
		"singlelayered",
		"singleminded",
		"singleseeded",
		"singleshelled",
		"singlestranded",
		"singlevalued",
		"sissified",
		"sistered",
		"sixgilled",
		"sixmembered",
		"sixsided",
		"sixstoried",
		"skulled",
		"slickered",
		"slipcased",
		"slowpaced",
		"slowwitted",
		"slurried",
		"smallminded",
		"smoothened",
		"smoothtongued",
		"snaggletoothed",
		"snouted",
		"snowballed",
		"snowcapped",
		"snowshed",
		"snowshoed",
		"snubnosed",
		"so-called",
		"sofabed",
		"softhearted",
		"sogged",
		"soled",
		"solidified",
		"soliped",
		"sorbed",
		"souled",
		"spearshaped",
		"specified",
		"spectacled",
		"sped",
		"speeched",
		"speechified",
		"speed",
		"spied",
		"spiffied",
		"spindleshaped",
		"spiritualised",
		"spirted",
		"splayfooted",
		"spoonfed",
		"spoonfeed",
		"spoonshaped",
		"spreadeagled",
		"squarejawed",
		"squareshaped",
		"squareshouldered",
		"squaretoed",
		"squeegeed",
		"staled",
		"starshaped",
		"starspangled",
		"starstudded",
		"statechartered",
		"statesponsored",
		"statued",
		"steadied",
		"steampowered",
		"steed",
		"steelhearted",
		"steepled",
		"sterned",
		"stiffnecked",
		"stilettoed",
		"stimied",
		"stinkweed",
		"stirrupshaped",
		"stockinged",
		"storeyed",
		"storied",
		"stouthearted",
		"straitlaced",
		"stratified",
		"strawberryflavored",
		"streambed",
		"stressinduced",
		"stretchered",
		"strictured",
		"strongbodied",
		"strongboned",
		"strongflavored",
		"stronghearted",
		"stronglimbed",
		"strongminded",
		"strongscented",
		"strongwilled",
		"stubbled",
		"studied",
		"stultified",
		"stupefied",
		"styed",
		"stymied",
		"subclassified",
		"subcommissioned",
		"subminiaturised",
		"subsaturated",
		"subulated",
		"suburbanised",
		"suburbanized",
		"suburbed",
		"succeed",
		"sueded",
		"sugarrelated",
		"sulfurized",
		"sunbed",
		"superhardened",
		"superinfected",
		"supersimplified",
		"surefooted",
		"sweetscented",
		"swifted",
		"swordshaped",
		"syllabified",
		"syphilized",
		"tabularized",
		"talented",
		"tarpapered",
		"tautomerized",
		"teated",
		"teed",
		"teenaged",
		"teetotaled",
		"tenderhearted",
		"tentacled",
		"tenured",
		"termed",
		"ternated",
		"testbed",
		"testified",
		"theatricalised",
		"theatricalized",
		"themed",
		"thicketed",
		"thickskinned",
		"thickwalled",
		"thighed",
		"thimbled",
		"thimblewitted",
		"thonged",
		"thoroughbred",
		"thralled",
		"threated",
		"throated",
		"throughbred",
		"thyroidectomised",
		"thyroidectomized",
		"tiaraed",
		"ticktocked",
		"tidied",
		"tightassed",
		"tightfisted",
		"tightlipped",
		"timehonoured",
		"tindered",
		"tined",
		"tinselled",
		"tippytoed",
		"tiptoed",
		"titled",
		"toed",
		"tomahawked",
		"tonged",
		"toolshed",
		"toothplated",
		"toplighted",
		"torchlighted",
		"toughhearted",
		"traditionalized",
		"trajected",
		"tranced",
		"transgendered",
		"transliterated",
		"translocated",
		"transmogrified",
		"treadled",
		"treed",
		"treelined",
		"tressed",
		"trialled",
		"triangled",
		"trifoliated",
		"trifoliolated",
		"trilobed",
		"trucklebed",
		"truehearted",
		"trumpetshaped",
		"trumpetweed",
		"tuberculated",
		"tumbleweed",
		"tunnelshaped",
		"turbaned",
		"turreted",
		"turtlenecked",
		"tuskshaped",
		"tweed",
		"twigged",
		"typified",
		"ulcered",
		"ultracivilised",
		"ultracivilized",
		"ultracooled",
		"ultradignified",
		"ultradispersed",
		"ultrafiltered",
		"ultrared",
		"ultrasimplified",
		"ultrasophisticated",
		"unabandoned",
		"unabashed",
		"unabbreviated",
		"unabetted",
		"unabolished",
		"unaborted",
		"unabraded",
		"unabridged",
		"unabsolved",
		"unabsorbed",
		"unaccelerated",
		"unaccented",
		"unaccentuated",
		"unacclimatised",
		"unacclimatized",
		"unaccompanied",
		"unaccomplished",
		"unaccosted",
		"unaccredited",
		"unaccrued",
		"unaccumulated",
		"unaccustomed",
		"unacidulated",
		"unacquainted",
		"unacquitted",
		"unactivated",
		"unactuated",
		"unadapted",
		"unaddicted",
		"unadjourned",
		"unadjudicated",
		"unadjusted",
		"unadmonished",
		"unadopted",
		"unadored",
		"unadorned",
		"unadsorbed",
		"unadulterated",
		"unadvertised",
		"unaerated",
		"unaffiliated",
		"unaggregated",
		"unagitated",
		"unaimed",
		"unaired",
		"unaliased",
		"unalienated",
		"unaligned",
		"unallocated",
		"unalloyed",
		"unalphabetized",
		"unamassed",
		"unamortized",
		"unamplified",
		"unanaesthetised",
		"unanaesthetized",
		"unaneled",
		"unanesthetised",
		"unanesthetized",
		"unangered",
		"unannealed",
		"unannexed",
		"unannihilated",
		"unannotated",
		"unanointed",
		"unanticipated",
		"unappareled",
		"unappendaged",
		"unapportioned",
		"unapprenticed",
		"unapproached",
		"unappropriated",
		"unarbitrated",
		"unarched",
		"unarchived",
		"unarmored",
		"unarmoured",
		"unarticulated",
		"unascertained",
		"unashamed",
		"unaspirated",
		"unassembled",
		"unasserted",
		"unassessed",
		"unassociated",
		"unassorted",
		"unassuaged",
		"unastonished",
		"unastounded",
		"unatoned",
		"unattained",
		"unattainted",
		"unattenuated",
		"unattributed",
		"unauctioned",
		"unaudited",
		"unauthenticated",
		"unautographed",
		"unaverted",
		"unawaked",
		"unawakened",
		"unawarded",
		"unawed",
		"unbaffled",
		"unbaited",
		"unbalconied",
		"unbanded",
		"unbanished",
		"unbaptised",
		"unbaptized",
		"unbarreled",
		"unbarrelled",
		"unbattered",
		"unbeaded",
		"unbearded",
		"unbeneficed",
		"unbesotted",
		"unbetrayed",
		"unbetrothed",
		"unbiased",
		"unbiassed",
		"unbigoted",
		"unbilled",
		"unblackened",
		"unblanketed",
		"unblasphemed",
		"unblazoned",
		"unblistered",
		"unblockaded",
		"unbloodied",
		"unbodied",
		"unbonded",
		"unbothered",
		"unbounded",
		"unbracketed",
		"unbranded",
		"unbreaded",
		"unbrewed",
		"unbridged",
		"unbridled",
		"unbroached",
		"unbudgeted",
		"unbuffed",
		"unbuffered",
		"unburnished",
		"unbutchered",
		"unbuttered",
		"uncached",
		"uncaked",
		"uncalcified",
		"uncalibrated",
		"uncamouflaged",
		"uncamphorated",
		"uncanceled",
		"uncancelled",
		"uncapitalized",
		"uncarbonated",
		"uncarpeted",
		"uncased",
		"uncashed",
		"uncastrated",
		"uncatalogued",
		"uncatalysed",
		"uncatalyzed",
		"uncategorised",
		"uncatered",
		"uncaulked",
		"uncelebrated",
		"uncensored",
		"uncensured",
		"uncertified",
		"unchambered",
		"unchanneled",
		"unchannelled",
		"unchaperoned",
		"uncharacterized",
		"uncharted",
		"unchartered",
		"unchastened",
		"unchastised",
		"unchelated",
		"uncherished",
		"unchilled",
		"unchristened",
		"unchronicled",
		"uncircumcised",
		"uncircumscribed",
		"uncited",
		"uncivilised",
		"uncivilized",
		"unclarified",
		"unclassed",
		"unclassified",
		"uncleaved",
		"unclimbed",
		"unclustered",
		"uncluttered",
		"uncoagulated",
		"uncoded",
		"uncodified",
		"uncoerced",
		"uncoined",
		"uncollapsed",
		"uncollated",
		"uncolonised",
		"uncolonized",
		"uncolumned",
		"uncombined",
		"uncommented",
		"uncommercialised",
		"uncommercialized",
		"uncommissioned",
		"uncommitted",
		"uncompacted",
		"uncompartmentalized",
		"uncompartmented",
		"uncompensated",
		"uncompiled",
		"uncomplicated",
		"uncompounded",
		"uncomprehened",
		"uncomputed",
		"unconcealed",
		"unconceded",
		"unconcluded",
		"uncondensed",
		"unconditioned",
		"unconfined",
		"unconfirmed",
		"uncongested",
		"unconglomerated",
		"uncongratulated",
		"unconjugated",
		"unconquered",
		"unconsecrated",
		"unconsoled",
		"unconsolidated",
		"unconstipated",
		"unconstricted",
		"unconstructed",
		"unconsumed",
		"uncontacted",
		"uncontracted",
		"uncontradicted",
		"uncontrived",
		"unconverted",
		"unconveyed",
		"unconvicted",
		"uncooked",
		"uncooled",
		"uncoordinated",
		"uncopyrighted",
		"uncored",
		"uncorrelated",
		"uncorroborated",
		"uncosted",
		"uncounseled",
		"uncounselled",
		"uncounterfeited",
		"uncoveted",
		"uncrafted",
		"uncramped",
		"uncrannied",
		"uncrazed",
		"uncreamed",
		"uncreased",
		"uncreated",
		"uncredentialled",
		"uncredited",
		"uncrested",
		"uncrevassed",
		"uncrippled",
		"uncriticised",
		"uncriticized",
		"uncropped",
		"uncrosslinked",
		"uncrowded",
		"uncrucified",
		"uncrumbled",
		"uncrystalized",
		"uncrystallised",
		"uncrystallized",
		"uncubed",
		"uncuddled",
		"uncued",
		"unculled",
		"uncultivated",
		"uncultured",
		"uncupped",
		"uncurated",
		"uncurbed",
		"uncurried",
		"uncurtained",
		"uncushioned",
		"undamped",
		"undampened",
		"undappled",
		"undarkened",
		"undated",
		"undaubed",
		"undazzled",
		"undeadened",
		"undeafened",
		"undebated",
		"undebunked",
		"undeceased",
		"undecimalized",
		"undeciphered",
		"undecked",
		"undeclared",
		"undecomposed",
		"undeconstructed",
		"undedicated",
		"undefeated",
		"undeferred",
		"undefied",
		"undefined",
		"undeflected",
		"undefrauded",
		"undefrayed",
		"undegassed",
		"undejected",
		"undelegated",
		"undeleted",
		"undelimited",
		"undelineated",
		"undemented",
		"undemolished",
		"undemonstrated",
		"undenatured",
		"undenied",
		"undented",
		"undeodorized",
		"undepicted",
		"undeputized",
		"underaged",
		"underarmed",
		"underassessed",
		"underbred",
		"underbudgeted",
		"undercapitalised",
		"undercapitalized",
		"underdiagnosed",
		"underdocumented",
		"underequipped",
		"underexploited",
		"underexplored",
		"underfed",
		"underfeed",
		"underfurnished",
		"undergoverned",
		"undergrazed",
		"underinflated",
		"underinsured",
		"underinvested",
		"underived",
		"undermaintained",
		"undermentioned",
		"undermotivated",
		"underperceived",
		"underpowered",
		"underprivileged",
		"underqualified",
		"underrehearsed",
		"underresourced",
		"underripened",
		"undersaturated",
		"undersexed",
		"undersized",
		"underspecified",
		"understaffed",
		"understocked",
		"understressed",
		"understudied",
		"underutilised",
		"underventilated",
		"undescaled",
		"undesignated",
		"undetached",
		"undetailed",
		"undetained",
		"undeteriorated",
		"undeterred",
		"undetonated",
		"undevised",
		"undevoted",
		"undevoured",
		"undiagnosed",
		"undialed",
		"undialysed",
		"undialyzed",
		"undiapered",
		"undiffracted",
		"undigested",
		"undignified",
		"undiluted",
		"undiminished",
		"undimmed",
		"undipped",
		"undirected",
		"undisciplined",
		"undiscouraged",
		"undiscussed",
		"undisfigured",
		"undisguised",
		"undisinfected",
		"undismayed",
		"undisposed",
		"undisproved",
		"undisputed",
		"undisrupted",
		"undissembled",
		"undissipated",
		"undissociated",
		"undissolved",
		"undistilled",
		"undistorted",
		"undistracted",
		"undistributed",
		"undisturbed",
		"undiversified",
		"undiverted",
		"undivulged",
		"undoctored",
		"undocumented",
		"undomesticated",
		"undosed",
		"undramatised",
		"undrilled",
		"undrugged",
		"undubbed",
		"unduplicated",
		"uneclipsed",
		"unedged",
		"unedited",
		"unejaculated",
		"unejected",
		"unelaborated",
		"unelapsed",
		"unelected",
		"unelectrified",
		"unelevated",
		"unelongated",
		"unelucidated",
		"unemaciated",
		"unemancipated",
		"unemasculated",
		"unembalmed",
		"unembed",
		"unembellished",
		"unembodied",
		"unemboldened",
		"unemerged",
		"unenacted",
		"unencoded",
		"unencrypted",
		"unencumbered",
		"unendangered",
		"unendorsed",
		"unenergized",
		"unenfranchised",
		"unengraved",
		"unenhanced",
		"unenlarged",
		"unenlivened",
		"unenraptured",
		"unenriched",
		"unentangled",
		"unentitled",
		"unentombed",
		"unentranced",
		"unentwined",
		"unenumerated",
		"unenveloped",
		"unenvied",
		"unequaled",
		"unequalised",
		"unequalized",
		"unequalled",
		"unequipped",
		"unerased",
		"unerected",
		"uneroded",
		"unerupted",
		"unescorted",
		"unestablished",
		"unevaluated",
		"unexaggerated",
		"unexampled",
		"unexcavated",
		"unexceeded",
		"unexcelled",
		"unexecuted",
		"unexerted",
		"unexhausted",
		"unexpensed",
		"unexperienced",
		"unexpired",
		"unexploited",
		"unexplored",
		"unexposed",
		"unexpurgated",
		"unextinguished",
		"unfabricated",
		"unfaceted",
		"unfanned",
		"unfashioned",
		"unfathered",
		"unfathomed",
		"unfattened",
		"unfavored",
		"unfavoured",
		"unfazed",
		"unfeathered",
		"unfed",
		"unfeigned",
		"unfermented",
		"unfertilised",
		"unfertilized",
		"unfilleted",
		"unfiltered",
		"unfinished",
		"unflavored",
		"unflavoured",
		"unflawed",
		"unfledged",
		"unfleshed",
		"unflurried",
		"unflushed",
		"unflustered",
		"unfluted",
		"unfocussed",
		"unforested",
		"unformatted",
		"unformulated",
		"unfortified",
		"unfractionated",
		"unfractured",
		"unfragmented",
		"unfrequented",
		"unfretted",
		"unfrosted",
		"unfueled",
		"unfunded",
		"unfurnished",
		"ungarbed",
		"ungarmented",
		"ungarnished",
		"ungeared",
		"ungerminated",
		"ungifted",
		"unglazed",
		"ungoverned",
		"ungraded",
		"ungrasped",
		"ungratified",
		"ungroomed",
		"ungrounded",
		"ungrouped",
		"ungummed",
		"ungusseted",
		"unhabituated",
		"unhampered",
		"unhandicapped",
		"unhardened",
		"unharvested",
		"unhasped",
		"unhatched",
		"unheralded",
		"unhindered",
		"unhomogenised",
		"unhomogenized",
		"unhonored",
		"unhonoured",
		"unhooded",
		"unhusked",
		"unhyphenated",
		"unified",
		"unillustrated",
		"unimpacted",
		"unimpaired",
		"unimpassioned",
		"unimpeached",
		"unimpelled",
		"unimplemented",
		"unimpregnated",
		"unimprisoned",
		"unimpugned",
		"unincorporated",
		"unincubated",
		"unincumbered",
		"unindemnified",
		"unindexed",
		"unindicted",
		"unindorsed",
		"uninduced",
		"unindustrialised",
		"unindustrialized",
		"uninebriated",
		"uninfected",
		"uninflated",
		"uninflected",
		"uninhabited",
		"uninhibited",
		"uninitialised",
		"uninitialized",
		"uninitiated",
		"uninoculated",
		"uninseminated",
		"uninsulated",
		"uninsured",
		"uninterpreted",
		"unintimidated",
		"unintoxicated",
		"unintroverted",
		"uninucleated",
		"uninverted",
		"uninvested",
		"uninvolved",
		"unissued",
		"unjaundiced",
		"unjointed",
		"unjustified",
		"unkeyed",
		"unkindled",
		"unlabelled",
		"unlacquered",
		"unlamented",
		"unlaminated",
		"unlarded",
		"unlaureled",
		"unlaurelled",
		"unleaded",
		"unleavened",
		"unled",
		"unlettered",
		"unlicenced",
		"unlighted",
		"unlimbered",
		"unlimited",
		"unlined",
		"unlipped",
		"unliquidated",
		"unlithified",
		"unlittered",
		"unliveried",
		"unlobed",
		"unlocalised",
		"unlocalized",
		"unlocated",
		"unlogged",
		"unlubricated",
		"unmagnified",
		"unmailed",
		"unmaimed",
		"unmaintained",
		"unmalted",
		"unmangled",
		"unmanifested",
		"unmanipulated",
		"unmannered",
		"unmanufactured",
		"unmapped",
		"unmarred",
		"unmastered",
		"unmatriculated",
		"unmechanised",
		"unmechanized",
		"unmediated",
		"unmedicated",
		"unmentioned",
		"unmerged",
		"unmerited",
		"unmetabolised",
		"unmetabolized",
		"unmetamorphosed",
		"unmethylated",
		"unmineralized",
		"unmitigated",
		"unmoderated",
		"unmodernised",
		"unmodernized",
		"unmodified",
		"unmodulated",
		"unmolded",
		"unmolested",
		"unmonitored",
		"unmortgaged",
		"unmotivated",
		"unmotorised",
		"unmotorized",
		"unmounted",
		"unmutated",
		"unmutilated",
		"unmyelinated",
		"unnaturalised",
		"unnaturalized",
		"unnotched",
		"unnourished",
		"unobligated",
		"unobstructed",
		"unoccupied",
		"unoiled",
		"unopposed",
		"unoptimised",
		"unordained",
		"unorganised",
		"unorganized",
		"unoriented",
		"unoriginated",
		"unornamented",
		"unoxidized",
		"unoxygenated",
		"unpacified",
		"unpackaged",
		"unpaired",
		"unparalleled",
		"unparallelled",
		"unparasitized",
		"unpardoned",
		"unparodied",
		"unpartitioned",
		"unpasteurised",
		"unpasteurized",
		"unpatented",
		"unpaved",
		"unpedigreed",
		"unpenetrated",
		"unpenned",
		"unperfected",
		"unperjured",
		"unpersonalised",
		"unpersuaded",
		"unperturbed",
		"unperverted",
		"unpestered",
		"unphosphorylated",
		"unphotographed",
		"unpigmented",
		"unpiloted",
		"unpledged",
		"unploughed",
		"unplumbed",
		"unpoised",
		"unpolarized",
		"unpoliced",
		"unpolled",
		"unpopulated",
		"unposed",
		"unpowered",
		"unprecedented",
		"unpredicted",
		"unprejudiced",
		"unpremeditated",
		"unprescribed",
		"unpressurised",
		"unpressurized",
		"unpriced",
		"unprimed",
		"unprincipled",
		"unprivileged",
		"unprized",
		"unprocessed",
		"unprofaned",
		"unprofessed",
		"unprohibited",
		"unprompted",
		"unpronounced",
		"unproposed",
		"unprospected",
		"unproved",
		"unpruned",
		"unpublicised",
		"unpublicized",
		"unpublished",
		"unpuckered",
		"unpunctuated",
		"unpurified",
		"unqualified",
		"unquantified",
		"unquenched",
		"unquoted",
		"unranked",
		"unrated",
		"unratified",
		"unrebuked",
		"unreckoned",
		"unrecompensed",
		"unreconciled",
		"unreconstructed",
		"unrectified",
		"unredeemed",
		"unrefined",
		"unrefreshed",
		"unrefrigerated",
		"unregarded",
		"unregimented",
		"unregistered",
		"unregulated",
		"unrehearsed",
		"unrelated",
		"unrelieved",
		"unrelinquished",
		"unrenewed",
		"unrented",
		"unrepealed",
		"unreplicated",
		"unreprimanded",
		"unrequited",
		"unrespected",
		"unrestricted",
		"unretained",
		"unretarded",
		"unrevised",
		"unrevived",
		"unrevoked",
		"unrifled",
		"unripened",
		"unrivaled",
		"unrivalled",
		"unroasted",
		"unroofed",
		"unrounded",
		"unruffled",
		"unsalaried",
		"unsalted",
		"unsanctified",
		"unsanctioned",
		"unsanded",
		"unsaponified",
		"unsated",
		"unsatiated",
		"unsatisfied",
		"unsaturated",
		"unscaled",
		"unscarred",
		"unscathed",
		"unscented",
		"unscheduled",
		"unschooled",
		"unscreened",
		"unscripted",
		"unseamed",
		"unseared",
		"unseasoned",
		"unseeded",
		"unsegmented",
		"unsegregated",
		"unselected",
		"unserviced",
		"unsexed",
		"unshamed",
		"unshaped",
		"unsharpened",
		"unsheared",
		"unshielded",
		"unshifted",
		"unshirted",
		"unshoed",
		"unshuttered",
		"unsifted",
		"unsighted",
		"unsilenced",
		"unsimplified",
		"unsized",
		"unskewed",
		"unskinned",
		"unslaked",
		"unsliced",
		"unsloped",
		"unsmoothed",
		"unsoiled",
		"unsoldered",
		"unsolicited",
		"unsolved",
		"unsophisticated",
		"unsorted",
		"unsourced",
		"unsoured",
		"unspaced",
		"unspanned",
		"unspecialised",
		"unspecialized",
		"unspecified",
		"unspiced",
		"unstaged",
		"unstandardised",
		"unstandardized",
		"unstapled",
		"unstarched",
		"unstarred",
		"unstated",
		"unsteadied",
		"unstemmed",
		"unsterilised",
		"unsterilized",
		"unstickered",
		"unstiffened",
		"unstifled",
		"unstigmatised",
		"unstigmatized",
		"unstilted",
		"unstippled",
		"unstipulated",
		"unstirred",
		"unstocked",
		"unstoked",
		"unstoppered",
		"unstratified",
		"unstressed",
		"unstriped",
		"unstructured",
		"unstudied",
		"unstumped",
		"unsubdued",
		"unsubmitted",
		"unsubsidised",
		"unsubsidized",
		"unsubstantiated",
		"unsubstituted",
		"unsugared",
		"unsummarized",
		"unsupervised",
		"unsuprised",
		"unsurveyed",
		"unswayed",
		"unsweetened",
		"unsyllabled",
		"unsymmetrized",
		"unsynchronised",
		"unsynchronized",
		"unsyncopated",
		"unsyndicated",
		"unsynthesized",
		"unsystematized",
		"untagged",
		"untainted",
		"untalented",
		"untanned",
		"untaped",
		"untapered",
		"untargeted",
		"untarnished",
		"untattooed",
		"untelevised",
		"untempered",
		"untenanted",
		"unterminated",
		"untextured",
		"unthickened",
		"unthinned",
		"unthrashed",
		"unthreaded",
		"unthrottled",
		"unticketed",
		"untiled",
		"untilled",
		"untilted",
		"untimbered",
		"untinged",
		"untinned",
		"untinted",
		"untitled",
		"untoasted",
		"untoggled",
		"untoothed",
		"untopped",
		"untoughened",
		"untracked",
		"untrammeled",
		"untrammelled",
		"untranscribed",
		"untransduced",
		"untransferred",
		"untranslated",
		"untransmitted",
		"untraumatized",
		"untraversed",
		"untufted",
		"untuned",
		"untutored",
		"unupgraded",
		"unupholstered",
		"unutilised",
		"unutilized",
		"unuttered",
		"unvaccinated",
		"unvacuumed",
		"unvalidated",
		"unvalued",
		"unvandalized",
		"unvaned",
		"unvanquished",
		"unvapourised",
		"unvapourized",
		"unvaried",
		"unvariegated",
		"unvarnished",
		"unvented",
		"unventilated",
		"unverbalised",
		"unverbalized",
		"unverified",
		"unversed",
		"unvetted",
		"unvictimized",
		"unviolated",
		"unvitrified",
		"unvocalized",
		"unvoiced",
		"unwaged",
		"unwarped",
		"unwarranted",
		"unwaxed",
		"unweakened",
		"unweaned",
		"unwearied",
		"unweathered",
		"unwebbed",
		"unwed",
		"unwedded",
		"unweeded",
		"unweighted",
		"unwelded",
		"unwinterized",
		"unwired",
		"unwitnessed",
		"unwonted",
		"unwooded",
		"unworshipped",
		"unwounded",
		"unzoned",
		"uprated",
		"uprighted",
		"upsized",
		"upswelled",
		"vacuolated",
		"valanced",
		"valueoriented",
		"varied",
		"vascularised",
		"vascularized",
		"vasectomised",
		"vaunted",
		"vectorised",
		"vectorized",
		"vegged",
		"verdured",
		"verified",
		"vermiculated",
		"vernacularized",
		"versified",
		"verticillated",
		"vesiculated",
		"vied",
		"vilified",
		"virtualised",
		"vitrified",
		"vivified",
		"volumed",
		"vulcanised",
		"wabbled",
		"wafered",
		"waisted",
		"walleyed",
		"wared",
		"warmblooded",
		"warmhearted",
		"warted",
		"waterbased",
		"waterbed",
		"watercooled",
		"watersaturated",
		"watershed",
		"wavegenerated",
		"waxweed",
		"weakhearted",
		"weakkneed",
		"weakminded",
		"wearied",
		"weatherised",
		"weatherstriped",
		"webfooted",
		"wedgeshaped",
		"weed",
		"weeviled",
		"welladapted",
		"welladjusted",
		"wellbred",
		"wellconducted",
		"welldefined",
		"welldisposed",
		"welldocumented",
		"wellequipped",
		"wellestablished",
		"wellfavored",
		"wellfed",
		"wellgrounded",
		"wellintentioned",
		"wellmannered",
		"wellminded",
		"wellorganised",
		"wellrounded",
		"wellshaped",
		"wellstructured",
		"whinged",
		"whinnied",
		"whiplashed",
		"whiskered",
		"wholehearted",
		"whorled",
		"widebased",
		"wideeyed",
		"widemeshed",
		"widemouthed",
		"widenecked",
		"widespaced",
		"wilded",
		"wildered",
		"wildeyed",
		"willinghearted",
		"windspeed",
		"winterfed",
		"winterfeed",
		"winterised",
		"wirehaired",
		"wised",
		"witchweed",
		"woaded",
		"wombed",
		"wooded",
		"woodshed",
		"wooled",
		"woolled",
		"woollyhaired",
		"woollystemmed",
		"woolyhaired",
		"woolyminded",
		"wormholed",
		"wormshaped",
		"wrappered",
		"wretched",
		"wronghearted",
		"ycleped",
		"yolked",
		"zincified",
		"zinckified",
		"zinkified",
		"zombified"
	];
};

},{}],87:[function(require,module,exports){
module.exports = function() {
	return [
		"to",
		"which",
		"who",
		"whom",
		"that",
		"whose",
		"after",
		"although",
		"as",
		"because",
		"before",
		"even if",
		"even though",
		"how",
		"if",
		"in order that",
		"inasmuch",
		"lest",
		"once",
		"provided",
		"since",
		"so that",
		"than",
		"though",
		"till",
		"unless",
		"until",
		"when",
		"whenever",
		"where",
		"whereas",
		"wherever",
		"whether",
		"while",
		"why",
		"by the time",
		"supposing",
		"no matter",
		"how",
		"what",
		"won't",
		"do",
		"does",
		"'ll",
		":"
	];
};

},{}],88:[function(require,module,exports){
var getSentences = require( "../stringProcessing/getSentences.js" );
var sentencesLength = require( "../stringProcessing/sentencesLength.js" );
var formatNumber = require( "../helpers/formatNumber" );
var sum = require( "lodash/sum" );
var reduce = require( "lodash/reduce" );

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

},{"./_baseGet":55}],76:[function(require,module,exports){
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

},{}],77:[function(require,module,exports){
/**
 * The base implementation of `_.sortBy` which uses `comparer` to define the
 * sort order of `array` and replaces criteria objects with their corresponding
 * values.
 *
 * @private
 * @param {Array} array The array to sort.
 * @param {Function} comparer The function to define sort order.
 * @returns {Array} Returns `array`.
 */
function baseSortBy(array, comparer) {
  var length = array.length;

  array.sort(comparer);
  while (length--) {
    array[length] = array[length].value;
  }
  return array;
}

module.exports = baseSortBy;

},{}],78:[function(require,module,exports){
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

},{"../helpers/formatNumber":45,"../stringProcessing/getSentences.js":108,"../stringProcessing/sentencesLength.js":124,"lodash/reduce":326,"lodash/sum":330}],89:[function(require,module,exports){
/** @module researches/stopWordsInKeyword */

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;

},{}],80:[function(require,module,exports){
var Symbol = require('./_Symbol'),
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
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

},{"./stopWordsInText.js":90}],90:[function(require,module,exports){
var stopwords = require( "../config/stopwords.js" )();
var toRegex = require( "../stringProcessing/stringToRegex.js" );

},{"./_Symbol":25,"./isSymbol":198}],81:[function(require,module,exports){
/**
 * The base implementation of `_.unary` without support for storing wrapper metadata.
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

},{}],82:[function(require,module,exports){
var SetCache = require('./_SetCache'),
    arrayIncludes = require('./_arrayIncludes'),
    arrayIncludesWith = require('./_arrayIncludesWith'),
    cacheHas = require('./_cacheHas'),
    createSet = require('./_createSet'),
    setToArray = require('./_setToArray');

},{"../config/stopwords.js":35,"../stringProcessing/stringToRegex.js":125}],91:[function(require,module,exports){
/** @module researches/stopWordsInUrl */

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

},{"./stopWordsInText.js":90}],92:[function(require,module,exports){
/** @module analyses/isUrlTooLong */

},{"./_SetCache":23,"./_arrayIncludes":34,"./_arrayIncludesWith":35,"./_cacheHas":83,"./_createSet":105,"./_setToArray":157}],83:[function(require,module,exports){
/**
 * Checks if a cache value for `key` exists.
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

},{}],93:[function(require,module,exports){
var wordCount = require( "../stringProcessing/countWords.js" );

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

},{"../stringProcessing/countWords.js":101}],94:[function(require,module,exports){
var Assessor = require( "./assessor.js" );

},{"./_stringToPath":163,"./isArray":184}],85:[function(require,module,exports){
/**
 * Checks if `value` is a global object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {null|Object} Returns `value` if it's a global object, else `null`.
 */
var SEOAssessor = function( i18n, options ) {
	Assessor.call( this, i18n, options );

	this._assessments = [
		introductionKeyword,
		keyphraseLength,
		keywordDensity,
		keywordStopWords,
		metaDescriptionKeyword,
		metaDescriptionLength,
		subheadingsKeyword,
		textCompetingLinks,
		textImages,
		textLength,
		textLinks,
		titleKeyword,
		titleLength,
		urlKeyword,
		urlLength,
		urlStopWords
	];
};

module.exports = SEOAssessor;

require( "util" ).inherits( module.exports, Assessor );


},{"./assessments/introductionKeywordAssessment.js":6,"./assessments/keyphraseLengthAssessment.js":7,"./assessments/keywordDensityAssessment.js":8,"./assessments/keywordStopWordsAssessment.js":9,"./assessments/metaDescriptionKeywordAssessment.js":10,"./assessments/metaDescriptionLengthAssessment.js":11,"./assessments/subheadingsKeywordAssessment.js":17,"./assessments/textCompetingLinksAssessment.js":18,"./assessments/textImagesAssessment.js":19,"./assessments/textLengthAssessment.js":20,"./assessments/textLinksAssessment.js":21,"./assessments/titleKeywordAssessment.js":23,"./assessments/titleLengthAssessment.js":24,"./assessments/urlKeywordAssessment.js":26,"./assessments/urlLengthAssessment.js":27,"./assessments/urlStopWordsAssessment.js":28,"./assessor.js":29,"util":516}],95:[function(require,module,exports){
/* jshint browser: true */

var isEmpty = require( "lodash/isEmpty" );
var isElement = require( "lodash/isElement" );
var isUndefined = require( "lodash/isUndefined" );
var clone = require( "lodash/clone" );
var defaultsDeep = require( "lodash/defaultsDeep" );
var forEach = require( "lodash/forEach" );
var debounce = require( "lodash/debounce" );

var stringToRegex = require( "../js/stringProcessing/stringToRegex.js" );
var stripHTMLTags = require( "../js/stringProcessing/stripHTMLTags.js" );
var sanitizeString = require( "../js/stringProcessing/sanitizeString.js" );
var stripSpaces = require( "../js/stringProcessing/stripSpaces.js" );
var replaceDiacritics = require( "../js/stringProcessing/replaceDiacritics.js" );
var transliterate = require( "../js/stringProcessing/transliterate.js" );
var analyzerConfig = require( "./config/config.js" );

var templates = require( "./templates.js" );
var snippetEditorTemplate = templates.snippetEditor;
var hiddenElement = templates.hiddenSpan;

var domManipulation = require( "./helpers/domManipulation.js" );

var defaults = {
	data: {
		title: "",
		metaDesc: "",
		urlPath: "",
		titleWidth: 0,
		metaHeight: 0
	},
	placeholder: {
		title:    "This is an example title - edit by clicking here",
		metaDesc: "Modify your meta description by editing it right here",
		urlPath:  "example-post/"
	},
	defaultValue: {
		title: "",
		metaDesc: ""
	},
	baseURL: "http://example.com/",
	callbacks: {
		saveSnippetData: function() {}
	},
	addTrailingSlash: true,
	metaDescriptionDate: ""
};

module.exports = checkGlobal;

},{}],86:[function(require,module,exports){
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

},{"./_Uint8Array":26}],87:[function(require,module,exports){
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
  var result = new buffer.constructor(buffer.length);
  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

},{}],88:[function(require,module,exports){
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

},{"./_cloneArrayBuffer":86}],89:[function(require,module,exports){
var addMapEntry = require('./_addMapEntry'),
    arrayReduce = require('./_arrayReduce'),
    mapToArray = require('./_mapToArray');

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
  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

module.exports = cloneMap;

},{"./_addMapEntry":28,"./_arrayReduce":38,"./_mapToArray":150}],90:[function(require,module,exports){
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

},{}],91:[function(require,module,exports){
var addSetEntry = require('./_addSetEntry'),
    arrayReduce = require('./_arrayReduce'),
    setToArray = require('./_setToArray');

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
  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

module.exports = cloneSet;

},{"./_addSetEntry":29,"./_arrayReduce":38,"./_setToArray":157}],92:[function(require,module,exports){
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

},{"./_Symbol":25}],93:[function(require,module,exports){
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

},{"./_cloneArrayBuffer":86}],94:[function(require,module,exports){
var isSymbol = require('./isSymbol');

/**
 * Compares values to sort them in ascending order.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {number} Returns the sort order indicator for `value`.
 */
function compareAscending(value, other) {
  if (value !== other) {
    var valIsDefined = value !== undefined,
        valIsNull = value === null,
        valIsReflexive = value === value,
        valIsSymbol = isSymbol(value);

    var othIsDefined = other !== undefined,
        othIsNull = other === null,
        othIsReflexive = other === other,
        othIsSymbol = isSymbol(other);

    if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
        (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
        (valIsNull && othIsDefined && othIsReflexive) ||
        (!valIsDefined && othIsReflexive) ||
        !valIsReflexive) {
      return 1;
    }
    if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
        (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
        (othIsNull && valIsDefined && valIsReflexive) ||
        (!othIsDefined && valIsReflexive) ||
        !othIsReflexive) {
      return -1;
    }
  }
  return 0;
}

module.exports = compareAscending;

},{"./isSymbol":198}],95:[function(require,module,exports){
var compareAscending = require('./_compareAscending');

/**
 * Used by `_.orderBy` to compare multiple properties of a value to another
 * and stable sort them.
 *
 * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
 * specify an order of "desc" for descending or "asc" for ascending sort order
 * of corresponding values.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {boolean[]|string[]} orders The order to sort by for each property.
 * @returns {number} Returns the sort order indicator for `object`.
 */
function compareMultiple(object, other, orders) {
  var index = -1,
      objCriteria = object.criteria,
      othCriteria = other.criteria,
      length = objCriteria.length,
      ordersLength = orders.length;

  while (++index < length) {
    var result = compareAscending(objCriteria[index], othCriteria[index]);
    if (result) {
      if (index >= ordersLength) {
        return result;
      }
      var order = orders[index];
      return result * (order == 'desc' ? -1 : 1);
    }
  }
  // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
  // that causes it, under certain circumstances, to provide the same value for
  // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
  // for more details.
  //
  // This also ensures a stable sort in V8 and other engines.
  // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
  return object.index - other.index;
}

module.exports = compareMultiple;

},{"./_compareAscending":94}],96:[function(require,module,exports){
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

},{}],97:[function(require,module,exports){
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

},{"./_assignValue":42}],98:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    getSymbols = require('./_getSymbols');

/**
 * Copies own symbol properties of `source` to `object`.
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

},{"./_copyObject":97,"./_getSymbols":115}],99:[function(require,module,exports){
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":154}],100:[function(require,module,exports){
var arrayAggregator = require('./_arrayAggregator'),
    baseAggregator = require('./_baseAggregator'),
    baseIteratee = require('./_baseIteratee'),
    isArray = require('./isArray');

/**
 * Creates a function like `_.groupBy`.
 *
 * @private
 * @param {Function} setter The function to set accumulator values.
 * @param {Function} [initializer] The accumulator object initializer.
 * @returns {Function} Returns the new aggregator function.
 */
function createAggregator(setter, initializer) {
  return function(collection, iteratee) {
    var func = isArray(collection) ? arrayAggregator : baseAggregator,
        accumulator = initializer ? initializer() : {};

	targetElement.innerHTML = snippetEditorTemplate( {
		raw: {
			title: this.data.title,
			snippetCite: this.data.urlPath,
			meta: this.data.metaDesc
		},
		rendered: {
			title: this.formatTitle(),
			baseUrl: this.formatUrl(),
			snippetCite: this.formatCite(),
			meta: this.formatMeta()
		},
		metaDescriptionDate: this.opts.metaDescriptionDate,
		placeholder: this.opts.placeholder,
		i18n: {
			edit: this.i18n.dgettext( "js-text-analysis", "Edit snippet" ),
			title: this.i18n.dgettext( "js-text-analysis", "SEO title" ),
			slug:  this.i18n.dgettext( "js-text-analysis", "Slug" ),
			metaDescription: this.i18n.dgettext( "js-text-analysis", "Meta description" ),
			save: this.i18n.dgettext( "js-text-analysis", "Close snippet editor" ),
			snippetPreview: this.i18n.dgettext( "js-text-analysis", "Snippet preview" ),
			titleLabel: this.i18n.dgettext( "js-text-analysis", "SEO title preview:" ),
			slugLabel: this.i18n.dgettext( "js-text-analysis", "Slug preview:" ),
			metaDescriptionLabel: this.i18n.dgettext( "js-text-analysis", "Meta description preview:" ),
			snippetPreviewDescription: this.i18n.dgettext(
				"js-text-analysis",
				"You can click on each element in the preview to jump to the Snippet Editor."
			)
		}
	} );

module.exports = createAggregator;

},{"./_arrayAggregator":31,"./_baseAggregator":44,"./_baseIteratee":65,"./isArray":184}],101:[function(require,module,exports){
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

},{"./_isIterateeCall":133,"./rest":212}],102:[function(require,module,exports){
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

},{"./isArrayLike":185}],103:[function(require,module,exports){
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

},{}],104:[function(require,module,exports){
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
    predicate = baseIteratee(predicate, 3);
    if (!isArrayLike(collection)) {
      var props = keys(collection);
    }
    var index = findIndexFunc(props || collection, function(value, key) {
      if (props) {
        key = value;
        value = iterable[key];
      }
      return predicate(value, key, iterable);
    }, fromIndex);
    return index > -1 ? collection[props ? props[index] : index] : undefined;
  };
}

module.exports = createFind;

},{"./_baseIteratee":65,"./isArrayLike":185,"./keys":201}],105:[function(require,module,exports){
var Set = require('./_Set'),
    noop = require('./noop'),
    setToArray = require('./_setToArray');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Creates a set of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set(values);
};

module.exports = createSet;

},{"./_Set":22,"./_setToArray":157,"./noop":207}],106:[function(require,module,exports){
var SetCache = require('./_SetCache'),
    arraySome = require('./_arraySome');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & UNORDERED_COMPARE_FLAG) ? new SetCache : undefined;

  stack.set(array, other);

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
            if (!seen.has(othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
              return seen.add(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, customizer, bitmask, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  return result;
}

	// As an ultimate fallback provide the user with a helpful message.
	if ( isEmpty( title ) ) {
		title = this.i18n.dgettext( "js-text-analysis", "Please provide an SEO title by editing the snippet below." );
	}

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

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
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
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
      // Coerce dates and booleans to numbers, dates to milliseconds and
      // booleans to `1` or `0` treating invalid dates coerced to `NaN` as
      // not equal.
      return +object == +other;

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case numberTag:
      // Treat `NaN` vs. `NaN` as equal.
      return (object != +object) ? other != +other : object == +other;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/6.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= UNORDERED_COMPARE_FLAG;
      stack.set(object, other);

      // Recursively compare objects (susceptible to call stack limits).
      return equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;

},{"./_Symbol":25,"./_Uint8Array":26,"./_equalArrays":106,"./_mapToArray":150,"./_setToArray":157}],108:[function(require,module,exports){
var baseHas = require('./_baseHas'),
    keys = require('./keys');

/** Used to compose bitmasks for comparison styles. */
var PARTIAL_COMPARE_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : baseHas(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);

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
          ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
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
  return result;
}

module.exports = equalObjects;

},{"./_baseHas":57,"./keys":201}],109:[function(require,module,exports){
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

},{"./_baseGetAllKeys":56,"./_getSymbols":115,"./keys":201}],110:[function(require,module,exports){
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

},{"./_baseProperty":74}],111:[function(require,module,exports){
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

},{"./_isKeyable":135}],112:[function(require,module,exports){
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

},{"./_isStrictComparable":138,"./keys":201}],113:[function(require,module,exports){
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

},{"./_baseIsNative":64,"./_getValue":117}],114:[function(require,module,exports){
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetPrototype = Object.getPrototypeOf;

/**
 * Gets the `[[Prototype]]` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {null|Object} Returns the `[[Prototype]]`.
 */
function getPrototype(value) {
  return nativeGetPrototype(Object(value));
}

module.exports = getPrototype;

},{}],115:[function(require,module,exports){
var stubArray = require('./stubArray');

/** Built-in value references. */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
function getSymbols(object) {
  // Coerce `object` to an object to avoid non-object errors in V8.
  // See https://bugs.chromium.org/p/v8/issues/detail?id=3443 for more details.
  return getOwnPropertySymbols(Object(object));
}

// Fallback for IE < 11.
if (!getOwnPropertySymbols) {
  getSymbols = stubArray;
}

module.exports = getSymbols;

},{"./stubArray":214}],116:[function(require,module,exports){
var DataView = require('./_DataView'),
    Map = require('./_Map'),
    Promise = require('./_Promise'),
    Set = require('./_Set'),
    WeakMap = require('./_WeakMap'),
    toSource = require('./_toSource');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

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
function getTag(value) {
  return objectToString.call(value);
}

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

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

},{"./_DataView":15,"./_Map":18,"./_Promise":20,"./_Set":22,"./_WeakMap":27,"./_toSource":165}],117:[function(require,module,exports){
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

},{}],118:[function(require,module,exports){
var castPath = require('./_castPath'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isIndex = require('./_isIndex'),
    isKey = require('./_isKey'),
    isLength = require('./isLength'),
    isString = require('./isString'),
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
  path = isKey(path, object) ? [path] : castPath(path);

  var result,
      index = -1,
      length = path.length;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result) {
    return result;
  }
  var length = object ? object.length : 0;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isString(object) || isArguments(object));
}

module.exports = hasPath;

},{"./_castPath":84,"./_isIndex":132,"./_isKey":134,"./_toKey":164,"./isArguments":183,"./isArray":184,"./isLength":191,"./isString":197}],119:[function(require,module,exports){
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
}

module.exports = hashClear;

},{"./_nativeCreate":153}],120:[function(require,module,exports){
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
  return this.has(key) && delete this.__data__[key];
}

module.exports = hashDelete;

},{}],121:[function(require,module,exports){
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

},{"./_nativeCreate":153}],122:[function(require,module,exports){
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

},{"./_nativeCreate":153}],123:[function(require,module,exports){
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
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;

},{"./_nativeCreate":153}],124:[function(require,module,exports){
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

},{"./_baseTimes":79,"./isArguments":183,"./isArray":184,"./isLength":191,"./isString":197}],125:[function(require,module,exports){
/**
 * Gets the index at which the first occurrence of `NaN` is found in `array`.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched `NaN`, else `-1`.
 */
function indexOfNaN(array, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    var other = array[index];
    if (other !== other) {
      return index;
    }
  }
  return -1;
}

module.exports = indexOfNaN;

},{}],126:[function(require,module,exports){
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

},{}],127:[function(require,module,exports){
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

},{"./_cloneArrayBuffer":86,"./_cloneDataView":88,"./_cloneMap":89,"./_cloneRegExp":90,"./_cloneSet":91,"./_cloneSymbol":92,"./_cloneTypedArray":93}],128:[function(require,module,exports){
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

},{"./_baseCreate":47,"./_getPrototype":114,"./_isPrototype":137}],129:[function(require,module,exports){
var isArguments = require('./isArguments'),
    isArray = require('./isArray');

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value);
}

module.exports = isFlattenable;

},{"./isArguments":183,"./isArray":184}],130:[function(require,module,exports){
var isArray = require('./isArray'),
    isFunction = require('./isFunction');

/**
 * Checks if `value` is a flattenable array and not a `_.matchesProperty`
 * iteratee shorthand.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenableIteratee(value) {
  return isArray(value) && !(value.length == 2 && !isFunction(value[0]));
}

module.exports = isFlattenableIteratee;

},{"./isArray":184,"./isFunction":190}],131:[function(require,module,exports){
/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

module.exports = isHostObject;

},{}],132:[function(require,module,exports){
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

},{}],133:[function(require,module,exports){
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

},{"./_isIndex":132,"./eq":172,"./isArrayLike":185,"./isObject":194}],134:[function(require,module,exports){
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

},{"./isArray":184,"./isSymbol":198}],135:[function(require,module,exports){
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

},{}],136:[function(require,module,exports){
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

},{"../js/stringProcessing/replaceDiacritics.js":121,"../js/stringProcessing/sanitizeString.js":123,"../js/stringProcessing/stringToRegex.js":125,"../js/stringProcessing/stripHTMLTags.js":126,"../js/stringProcessing/stripSpaces.js":129,"../js/stringProcessing/transliterate.js":131,"./config/config.js":31,"./helpers/domManipulation.js":43,"./templates.js":133,"lodash/clone":282,"lodash/debounce":283,"lodash/defaultsDeep":285,"lodash/forEach":292,"lodash/isElement":303,"lodash/isEmpty":304,"lodash/isUndefined":315}],96:[function(require,module,exports){
/** @module stringProcessing/addWordboundary */

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

},{}],97:[function(require,module,exports){
/** @module stringProcessing/checkNofollow */

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

},{}],98:[function(require,module,exports){
/** @module stringProcessing/cleanText */

  while (!(data = iterator.next()).done) {
    result.push(data.value);
  }
  return result;
}

module.exports = iteratorToArray;

},{}],140:[function(require,module,exports){
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

module.exports = listCacheClear;

},{}],141:[function(require,module,exports){
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
  return true;
}

module.exports = listCacheDelete;

},{"./_assocIndexOf":43}],142:[function(require,module,exports){
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

},{"./_assocIndexOf":43}],143:[function(require,module,exports){
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

},{"../stringProcessing/replaceDiacritics.js":121,"../stringProcessing/stripSpaces.js":129,"../stringProcessing/unifyWhitespace.js":132}],99:[function(require,module,exports){
/** @module stringProcessing/countSentences */

},{"./_assocIndexOf":43}],144:[function(require,module,exports){
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
module.exports = function( text ) {
	var sentences = getSentences( text );
	var sentenceCount = 0;
	for ( var i = 0; i < sentences.length; i++ ) {
		if ( sentences[ i ] !== "" && sentences[ i ] !== " " ) {
			sentenceCount++;
		}
	}
	return sentenceCount;
};

},{"../stringProcessing/getSentences.js":108}],100:[function(require,module,exports){
/** @module stringProcessing/countSyllables */

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;

},{"./_assocIndexOf":43}],145:[function(require,module,exports){
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
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;

},{"./_Hash":16,"./_ListCache":17,"./_Map":18}],146:[function(require,module,exports){
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
  return getMapData(this, key)['delete'](key);
}

module.exports = mapCacheDelete;

},{"./_getMapData":111}],147:[function(require,module,exports){
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

},{"./_getMapData":111}],148:[function(require,module,exports){
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

},{"./_getMapData":111}],149:[function(require,module,exports){
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
  getMapData(this, key).set(key, value);
  return this;
}

module.exports = mapCacheSet;

},{"./_getMapData":111}],150:[function(require,module,exports){
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

},{"../config/syllables.js":36,"../stringProcessing/cleanText.js":98,"../stringProcessing/createRegexFromArray.js":102,"lodash/forEach":292,"lodash/map":318}],101:[function(require,module,exports){
/** @module stringProcessing/countWords */

module.exports = mapToArray;

},{}],151:[function(require,module,exports){
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

},{"../stringProcessing/getWords.js":111}],102:[function(require,module,exports){
/** @module stringProcessing/createRegexFromArray */

},{}],152:[function(require,module,exports){
var baseMerge = require('./_baseMerge'),
    isObject = require('./isObject');

/**
 * Used by `_.defaultsDeep` to customize its `_.merge` use.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to merge.
 * @param {Object} object The parent object of `objValue`.
 * @param {Object} source The parent object of `srcValue`.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 * @returns {*} Returns the value to assign.
 */
function mergeDefaults(objValue, srcValue, key, object, source, stack) {
  if (isObject(objValue) && isObject(srcValue)) {
    baseMerge(objValue, srcValue, undefined, mergeDefaults, stack.set(srcValue, objValue));
  }
  return objValue;
}

module.exports = mergeDefaults;

},{"./_baseMerge":71,"./isObject":194}],153:[function(require,module,exports){
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

},{"../stringProcessing/addWordboundary.js":96,"lodash/map":318}],103:[function(require,module,exports){
/** @module stringProcessing/createRegexFromDoubleArray */

},{"./_getNative":113}],154:[function(require,module,exports){
(function (global){
var checkGlobal = require('./_checkGlobal');

/** Detect free variable `global` from Node.js. */
var freeGlobal = checkGlobal(typeof global == 'object' && global);

/** Detect free variable `self`. */
var freeSelf = checkGlobal(typeof self == 'object' && self);

},{"../stringProcessing/addWordboundary.js":96}],104:[function(require,module,exports){
/** @module stringProcessing/findKeywordInUrl */

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || thisGlobal || Function('return this')();

module.exports = root;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./_checkGlobal":85}],155:[function(require,module,exports){
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
module.exports = function( url, keyword, locale ) {
	var formatUrl = url.match( />(.*)/ig );

	if ( formatUrl !== null ) {
		formatUrl = formatUrl[ 0 ].replace( /<.*?>\s?/ig, "" );
		return matchTextWithTransliteration( formatUrl, keyword, locale ).length > 0;
	}
	return false;
};

},{"./matchTextWithTransliteration.js":115}],105:[function(require,module,exports){
/** @module stringProcessing/getAlttagContent */

var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

module.exports = setCacheAdd;

},{}],156:[function(require,module,exports){
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

},{"../stringProcessing/stripSpaces.js":129}],106:[function(require,module,exports){
/** @module stringProcessing/getAnchorsFromText */

},{}],157:[function(require,module,exports){
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

},{}],107:[function(require,module,exports){
/** @module stringProcess/getLinkType */

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
}

module.exports = function( text, url ) {
	var linkType = "other";

	// Matches all links that start with http:// and https://, case insensitive and global
	if ( text.match( /https?:\/\//ig ) !== null ) {
		linkType = "external";
		var urlMatch = text.match( url );
		if ( urlMatch !== null && urlMatch[ 0 ].length !== 0 ) {
			linkType = "internal";
		}
	}
	return linkType;
};

},{}],108:[function(require,module,exports){
var map = require( "lodash/map" );
var isUndefined = require( "lodash/isUndefined" );
var forEach = require( "lodash/forEach" );
var isNaN = require( "lodash/isNaN" );
var filter = require( "lodash/filter" );
var flatMap = require( "lodash/flatMap" );
var isEmpty = require( "lodash/isEmpty" );
var negate = require( "lodash/negate" );
var memoize = require( "lodash/memoize" );

var core = require( "tokenizer2/core" );

var getBlocks = require( "../helpers/html.js" ).getBlocks;
var normalizeQuotes = require( "../stringProcessing/quotes.js" ).normalize;

// All characters that indicate a sentence delimiter.
var fullStop = ".";
var sentenceDelimiters = "?!;";
var newLines = "\n\r|\n|\r";

var fullStopRegex = new RegExp( "^[" + fullStop + "]$" );
var sentenceDelimiterRegex = new RegExp( "^[" + sentenceDelimiters + "]$" );
var sentenceRegex = new RegExp( "^[^" + fullStop + sentenceDelimiters + "<\\(\\)\\[\\]]+$" );
var htmlStartRegex = /^<([^>\s\/]+)[^>]*>$/mi;
var htmlEndRegex = /^<\/([^>\s]+)[^>]*>$/mi;
var newLineRegex = new RegExp( newLines );

var blockStartRegex = /^\s*[\[\(\{]\s*$/;
var blockEndRegex = /^\s*[\]\)}]\s*$/;

var tokens = [];
var sentenceTokenizer;

},{"./_ListCache":17}],159:[function(require,module,exports){
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
  return this.__data__['delete'](key);
}

module.exports = stackDelete;

},{}],160:[function(require,module,exports){
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

},{}],161:[function(require,module,exports){
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

},{}],162:[function(require,module,exports){
var ListCache = require('./_ListCache'),
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
  var cache = this.__data__;
  if (cache instanceof ListCache && cache.__data__.length == LARGE_ARRAY_SIZE) {
    cache = this.__data__ = new MapCache(cache.__data__);
  }
  cache.set(key, value);
  return this;
}

module.exports = stackSet;

},{"./_ListCache":17,"./_MapCache":19}],163:[function(require,module,exports){
var memoize = require('./memoize'),
    toString = require('./toString');

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(\.|\[\])(?:\4|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  var result = [];
  toString(string).replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;

},{"./memoize":204,"./toString":221}],164:[function(require,module,exports){
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

},{"./isSymbol":198}],165:[function(require,module,exports){
/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
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

},{}],166:[function(require,module,exports){
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

},{"./_copyObject":97,"./_createAssigner":101,"./keysIn":202}],167:[function(require,module,exports){
var baseClone = require('./_baseClone');

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
  return baseClone(value, false, true);
}

module.exports = clone;

},{"./_baseClone":46}],168:[function(require,module,exports){
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

},{"./isObject":194,"./now":208,"./toNumber":219}],169:[function(require,module,exports){
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

},{"./_apply":30,"./_assignInDefaults":40,"./assignInWith":166,"./rest":212}],170:[function(require,module,exports){
var apply = require('./_apply'),
    mergeDefaults = require('./_mergeDefaults'),
    mergeWith = require('./mergeWith'),
    rest = require('./rest');

/**
 * This method is like `_.defaults` except that it recursively assigns
 * default properties.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.10.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaults
 * @example
 *
 * _.defaultsDeep({ 'user': { 'name': 'barney' } }, { 'user': { 'name': 'fred', 'age': 36 } });
 * // => { 'user': { 'name': 'barney', 'age': 36 } }
 *
 */
var defaultsDeep = rest(function(args) {
  args.push(undefined, mergeDefaults);
  return apply(mergeWith, undefined, args);
});

module.exports = defaultsDeep;

},{"./_apply":30,"./_mergeDefaults":152,"./mergeWith":206,"./rest":212}],171:[function(require,module,exports){
var baseDifference = require('./_baseDifference'),
    baseFlatten = require('./_baseFlatten'),
    isArrayLikeObject = require('./isArrayLikeObject'),
    rest = require('./rest');

},{"../helpers/html.js":46,"../stringProcessing/quotes.js":118,"lodash/filter":288,"lodash/flatMap":291,"lodash/forEach":292,"lodash/isEmpty":304,"lodash/isNaN":307,"lodash/isUndefined":315,"lodash/map":318,"lodash/memoize":319,"lodash/negate":322,"tokenizer2/core":338}],109:[function(require,module,exports){
/**
 * Creates an array of unique `array` values not included in the other given
 * arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * for equality comparisons. The order of result values is determined by the
 * order they occur in the first array.
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
var difference = rest(function(array, values) {
  return isArrayLikeObject(array)
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
    : [];
});

},{}],110:[function(require,module,exports){
var map = require( "lodash/map" );

},{"./_baseDifference":48,"./_baseFlatten":52,"./isArrayLikeObject":186,"./rest":212}],172:[function(require,module,exports){
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

},{}],173:[function(require,module,exports){
var arrayFilter = require('./_arrayFilter'),
    baseFilter = require('./_baseFilter'),
    baseIteratee = require('./_baseIteratee'),
    isArray = require('./isArray');

/**
 * Iterates over elements of `collection`, returning an array of all elements
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Array|Function|Object|string} [predicate=_.identity]
 *  The function invoked per iteration.
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

module.exports = {
	getSubheadings: getSubheadings,
	getSubheadingContents: getSubheadingContents
};

},{"lodash/map":318}],111:[function(require,module,exports){
/** @module stringProcessing/countWords */

},{"./_arrayFilter":33,"./_baseFilter":50,"./_baseIteratee":65,"./isArray":184}],174:[function(require,module,exports){
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
 * @param {Array|Object} collection The collection to search.
 * @param {Array|Function|Object|string} [predicate=_.identity]
 *  The function invoked per iteration.
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

},{"./removeSentenceTerminators.js":120,"./stripHTMLTags.js":126,"./stripSpaces.js":129,"lodash/filter":288,"lodash/map":318}],112:[function(require,module,exports){
/** @module stringProcessing/imageInText */

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
 * @param {Array} array The array to search.
 * @param {Array|Function|Object|string} [predicate=_.identity]
 *  The function invoked per iteration.
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
  var length = array ? array.length : 0;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return baseFindIndex(array, baseIteratee(predicate, 3), index);
}

},{"./matchStringWithRegex.js":114}],113:[function(require,module,exports){
var map = require( "lodash/map" );
var flatMap = require( "lodash/flatMap" );
var filter = require( "lodash/filter" );

},{"./_baseFindIndex":51,"./_baseIteratee":65,"./toInteger":218}],176:[function(require,module,exports){
var arrayEach = require('./_arrayEach'),
    baseEach = require('./_baseEach'),
    baseIteratee = require('./_baseIteratee'),
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
 * _([1, 2]).forEach(function(value) {
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
  return func(collection, baseIteratee(iteratee, 3));
}

module.exports = forEach;

},{"./_arrayEach":32,"./_baseEach":49,"./_baseIteratee":65,"./isArray":184}],177:[function(require,module,exports){
arguments[4][176][0].apply(exports,arguments)
},{"./_arrayEach":32,"./_baseEach":49,"./_baseIteratee":65,"./isArray":184,"dup":176}],178:[function(require,module,exports){
var baseGet = require('./_baseGet');

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is used in its place.
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

},{"./_baseGet":55}],179:[function(require,module,exports){
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

},{"../helpers/html":46,"lodash/filter":288,"lodash/flatMap":291,"lodash/map":318}],114:[function(require,module,exports){
/** @module stringProcessing/matchStringWithRegex */

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

},{}],115:[function(require,module,exports){
var map = require( "lodash/map" );
var addWordBoundary = require( "./addWordboundary.js" );
var stripSpaces = require( "./stripSpaces.js" );
var transliterate = require( "./transliterate.js" );

},{"./_baseHasIn":58,"./_hasPath":118}],181:[function(require,module,exports){
/**
 * This method returns the first argument given to it.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],182:[function(require,module,exports){
var baseInRange = require('./_baseInRange'),
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
  start = toNumber(start) || 0;
  if (end === undefined) {
    end = start;
    start = 0;
  } else {
    end = toNumber(end) || 0;
  }
  number = toNumber(number);
  return baseInRange(number, start, end);
}

module.exports = inRange;

},{"./_baseInRange":59,"./toNumber":219}],183:[function(require,module,exports){
var isArrayLikeObject = require('./isArrayLikeObject');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

},{"./addWordboundary.js":96,"./stripSpaces.js":129,"./transliterate.js":131,"lodash/map":318}],116:[function(require,module,exports){
/** @module stringProcessing/matchTextWithWord */

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

},{"../stringProcessing/matchTextWithTransliteration.js":115,"../stringProcessing/stripNonTextTags.js":127,"../stringProcessing/unifyWhitespace.js":132}],117:[function(require,module,exports){
var wordBoundaries = require( "../language/wordBoundaries.js" )();
var includes = require( "lodash/includes" );

},{"./isArrayLikeObject":186}],184:[function(require,module,exports){
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

},{}],185:[function(require,module,exports){
var getLength = require('./_getLength'),
    isFunction = require('./isFunction'),
    isLength = require('./isLength');

},{"../language/wordBoundaries.js":51,"lodash/includes":297}],118:[function(require,module,exports){
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

},{}],119:[function(require,module,exports){
/** @module stringProcessing/removeNonWordCharacters.js */

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @param {string} string The string to replace spaces from.
 * @returns {string} string The string without spaces.
 */
module.exports = function( string ) {
	return string.replace( /[\s\n\r\t\.,'\(\)\"\+;!?:\/]/g, "" );
};

},{}],120:[function(require,module,exports){
// These are sentence terminators, that never should be in the middle of a word.
var sentenceTerminators = /[.?!:;,]/g;

/**
 * Replaces sentence terminators from the text.
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

},{}],121:[function(require,module,exports){
/** @module stringProcessing/replaceDiacritics */

},{"./isArrayLike":185,"./isObjectLike":195}],187:[function(require,module,exports){
var root = require('./_root'),
    stubFalse = require('./stubFalse');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module;

},{"../config/diacritics.js":32}],122:[function(require,module,exports){
/** @module stringProcessing/replaceString */

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
var isBuffer = !Buffer ? stubFalse : function(value) {
  return value instanceof Buffer;
};

},{}],123:[function(require,module,exports){
/** @module stringProcessing/sanitizeString */

},{"./_root":154,"./stubFalse":215}],188:[function(require,module,exports){
var isObjectLike = require('./isObjectLike'),
    isPlainObject = require('./isPlainObject');

/**
 * Checks if `value` is likely a DOM element.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a DOM element,
 *  else `false`.
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

},{"../stringProcessing/stripHTMLTags.js":126,"../stringProcessing/stripSpaces.js":129}],124:[function(require,module,exports){
var wordCount = require( "./countWords.js" );
var forEach = require( "lodash/forEach" );
var stripHTMLTags = require( "./stripHTMLTags.js" );

},{"./isObjectLike":195,"./isPlainObject":196}],189:[function(require,module,exports){
var getTag = require('./_getTag'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isArrayLike = require('./isArrayLike'),
    isBuffer = require('./isBuffer'),
    isFunction = require('./isFunction'),
    isObjectLike = require('./isObjectLike'),
    isString = require('./isString'),
    keys = require('./keys');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

},{"./countWords.js":101,"./stripHTMLTags.js":126,"lodash/forEach":292}],125:[function(require,module,exports){
/** @module stringProcessing/stringToRegex */
var isUndefined = require( "lodash/isUndefined" );
var replaceDiacritics = require( "../stringProcessing/replaceDiacritics.js" );
var sanitizeString = require( "../stringProcessing/sanitizeString.js" );
var addWordBoundary = require( "../stringProcessing/addWordboundary.js" );

/** Detect if properties shadowing those on `Object.prototype` are non-enumerable. */
var nonEnumShadows = !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf');

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
  if (isArrayLike(value) &&
      (isArray(value) || isString(value) || isFunction(value.splice) ||
        isArguments(value) || isBuffer(value))) {
    return !value.length;
  }
  if (isObjectLike(value)) {
    var tag = getTag(value);
    if (tag == mapTag || tag == setTag) {
      return !value.size;
    }
  }
  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return !(nonEnumShadows && keys(value).length);
}

module.exports = isEmpty;

},{"./_getTag":116,"./isArguments":183,"./isArray":184,"./isArrayLike":185,"./isBuffer":187,"./isFunction":190,"./isObjectLike":195,"./isString":197,"./keys":201}],190:[function(require,module,exports){
var isObject = require('./isObject');

},{"../stringProcessing/addWordboundary.js":96,"../stringProcessing/replaceDiacritics.js":121,"../stringProcessing/sanitizeString.js":123,"lodash/isUndefined":315,"lodash/memoize":319}],126:[function(require,module,exports){
/** @module stringProcessing/stripHTMLTags */

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
module.exports = function( text ) {
	text = text.replace( /(<([^>]+)>)/ig, " " );
	text = stripSpaces( text );
	return text;
};

},{"../stringProcessing/stripSpaces.js":129}],127:[function(require,module,exports){
/** @module stringProcessing/stripNonTextTags */

var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

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

},{"../stringProcessing/stripSpaces.js":129}],128:[function(require,module,exports){
/** @module stringProcessing/stripNumbers */

},{"./isObject":194}],191:[function(require,module,exports){
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

},{"../stringProcessing/stripSpaces.js":129}],129:[function(require,module,exports){
/** @module stringProcessing/stripSpaces */

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

},{"./isNumber":193}],193:[function(require,module,exports){
var isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var numberTag = '[object Number]';

},{}],130:[function(require,module,exports){
var replaceString = require( "../stringProcessing/replaceString.js" );
var removalWords = require( "../config/removalWords.js" )();
var matchTextWithTransliteration = require( "../stringProcessing/matchTextWithTransliteration.js" );

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

},{"../config/removalWords.js":34,"../stringProcessing/matchTextWithTransliteration.js":115,"../stringProcessing/replaceString.js":122}],131:[function(require,module,exports){
/** @module stringProcessing/replaceDiacritics */

module.exports = isNumber;

},{"./isObjectLike":195}],194:[function(require,module,exports){
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

},{"../config/transliterations.js":38}],132:[function(require,module,exports){
/** @module stringProcessing/unifyWhitespace */

},{}],195:[function(require,module,exports){
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

},{}],133:[function(require,module,exports){
(function (global){
;(function() {
  var undefined;

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object,
 *  else `false`.
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
  if (!isObjectLike(value) ||
      objectToString.call(value) != objectTag || isHostObject(value)) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return (typeof Ctor == 'function' &&
    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
}

module.exports = isPlainObject;

},{"./_getPrototype":114,"./_isHostObject":131,"./isObjectLike":195}],197:[function(require,module,exports){
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

},{"./isArray":184,"./isObjectLike":195}],198:[function(require,module,exports){
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

},{"./isObjectLike":195}],199:[function(require,module,exports){
var isLength = require('./isLength'),
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

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
function isTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
}

module.exports = isTypedArray;

},{"./isLength":191,"./isObjectLike":195}],200:[function(require,module,exports){
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

},{}],201:[function(require,module,exports){
var baseHas = require('./_baseHas'),
    baseKeys = require('./_baseKeys'),
    indexKeys = require('./_indexKeys'),
    isArrayLike = require('./isArrayLike'),
    isIndex = require('./_isIndex'),
    isPrototype = require('./_isPrototype');

  templates['assessmentPresenterResult'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {
    __p += '<ul class="wpseoanalysis assessment-results">\n    ';
     for (var i in scores) {
    __p += '\n        <li class="score">\n            <span class="assessment-results__mark-container">\n                ';
     if ( scores[ i ].marker ) {
    __p += '\n                    <button type="button" aria-label="' +
    ((__t = ( i18n.markInText )) == null ? '' : __t) +
    '" class="assessment-results__mark icon-eye-inactive js-assessment-results__mark-' +
    ((__t = ( scores[ i ].identifier )) == null ? '' : __t) +
    ' yoast-tooltip yoast-tooltip-s"><span class="screen-reader-text">' +
    ((__t = ( i18n.markInText )) == null ? '' : __t) +
    '</span></button>\n                ';
     }
    __p += '\n            </span>\n            <span class="wpseo-score-icon ' +
    __e( scores[ i ].className ) +
    '"></span>\n            <span class="screen-reader-text">' +
    ((__t = ( scores[ i ].screenReaderText )) == null ? '' : __t) +
    '</span>\n            <span class="wpseo-score-text">' +
    ((__t = ( scores[ i ].text )) == null ? '' : __t) +
    '</span>\n        </li>\n    ';
     }
    __p += '\n</ul>\n<button type="button" class="assessment-results__remove-marks js-assessment-results__remove-marks">' +
    ((__t = ( i18n.removeMarks )) == null ? '' : __t) +
    '</button>\n';

  for (var key in object) {
    if (baseHas(object, key) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length))) &&
        !(isProto && key == 'constructor')) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keys;

},{"./_baseHas":57,"./_baseKeys":66,"./_indexKeys":124,"./_isIndex":132,"./_isPrototype":137,"./isArrayLike":185}],202:[function(require,module,exports){
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],134:[function(require,module,exports){
var isUndefined = require( "lodash/isUndefined" );
var isNumber = require( "lodash/isNumber" );

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
 * @param {Array|Function|Object|string} [iteratee=_.identity]
 *  The function invoked per iteration.
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

/**
 * Construct the AssessmentResult value object.
 *
 * @param {Object} values The values for this assessment result.
 *
 * @constructor
 */
var AssessmentResult = function( values ) {
	this._hasScore = false;
	this._identifier = "";
	this._hasMarks = false;
	this._marker = emptyMarker;
	this.score = 0;
	this.text = "";

	if ( isUndefined( values ) ) {
		values = {};
	}

	if ( !isUndefined( values.score ) ) {
		this.setScore( values.score );
	}

	if ( !isUndefined( values.text ) ) {
		this.setText( values.text );
	}
};

},{"./_arrayMap":36,"./_baseIteratee":65,"./_baseMap":68,"./isArray":184}],204:[function(require,module,exports){
var MapCache = require('./_MapCache');

/** Used as the `TypeError` message for "Functions" methods. */
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
 * [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
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
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
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
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

module.exports = memoize;

},{"./_MapCache":19}],205:[function(require,module,exports){
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
 */
var merge = createAssigner(function(object, source, srcIndex) {
  baseMerge(object, source, srcIndex);
});

module.exports = merge;

},{"./_baseMerge":71,"./_createAssigner":101}],206:[function(require,module,exports){
var baseMerge = require('./_baseMerge'),
    createAssigner = require('./_createAssigner');

/**
 * This method is like `_.merge` except that it accepts `customizer` which
 * is invoked to produce the merged values of the destination and source
 * properties. If `customizer` returns `undefined`, merging is handled by the
 * method instead. The `customizer` is invoked with seven arguments:
 * (objValue, srcValue, key, object, source, stack).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   if (_.isArray(objValue)) {
 *     return objValue.concat(srcValue);
 *   }
 * }
 *
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
 * _.mergeWith(object, other, customizer);
 * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
 */
var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
  baseMerge(object, source, srcIndex, customizer);
});

},{"lodash/isNumber":308,"lodash/isUndefined":315}],135:[function(require,module,exports){
var defaults = require( "lodash/defaults" );

},{"./_baseMerge":71,"./_createAssigner":101}],207:[function(require,module,exports){
/**
 * A method that returns `undefined`.
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

},{}],208:[function(require,module,exports){
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
function now() {
  return Date.now();
}

module.exports = now;

},{}],209:[function(require,module,exports){
var createAggregator = require('./_createAggregator');

/**
 * Creates an array of elements split into two groups, the first of which
 * contains elements `predicate` returns truthy for, the second of which
 * contains elements `predicate` returns falsey for. The predicate is
 * invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Array|Function|Object|string} [predicate=_.identity]
 *  The function invoked per iteration.
 * @returns {Array} Returns the array of grouped elements.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': false },
 *   { 'user': 'fred',    'age': 40, 'active': true },
 *   { 'user': 'pebbles', 'age': 1,  'active': false }
 * ];
 *
 * _.partition(users, function(o) { return o.active; });
 * // => objects for [['fred'], ['barney', 'pebbles']]
 *
 * // The `_.matches` iteratee shorthand.
 * _.partition(users, { 'age': 1, 'active': false });
 * // => objects for [['pebbles'], ['barney', 'fred']]
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.partition(users, ['active', false]);
 * // => objects for [['barney', 'pebbles'], ['fred']]
 *
 * // The `_.property` iteratee shorthand.
 * _.partition(users, 'active');
 * // => objects for [['fred'], ['barney', 'pebbles']]
 */
var partition = createAggregator(function(result, value, key) {
  result[key ? 0 : 1].push(value);
}, function() { return [[], []]; });

module.exports = partition;

},{"lodash/defaults":284}],136:[function(require,module,exports){
var defaults = require( "lodash/defaults" );
var sanitizeString = require( "../stringProcessing/sanitizeString.js" );

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

},{"./_baseProperty":74,"./_basePropertyDeep":75,"./_isKey":134,"./_toKey":164}],211:[function(require,module,exports){
var arrayReduce = require('./_arrayReduce'),
    baseEach = require('./_baseEach'),
    baseIteratee = require('./_baseIteratee'),
    baseReduce = require('./_baseReduce'),
    isArray = require('./isArray');

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

},{"./_arrayReduce":38,"./_baseEach":49,"./_baseIteratee":65,"./_baseReduce":76,"./isArray":184}],212:[function(require,module,exports){
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

},{"./_apply":30,"./toInteger":218}],213:[function(require,module,exports){
var baseFlatten = require('./_baseFlatten'),
    baseOrderBy = require('./_baseOrderBy'),
    isArray = require('./isArray'),
    isFlattenableIteratee = require('./_isFlattenableIteratee'),
    isIterateeCall = require('./_isIterateeCall'),
    rest = require('./rest');

/**
 * Creates an array of elements, sorted in ascending order by the results of
 * running each element in a collection thru each iteratee. This method
 * performs a stable sort, that is, it preserves the original sort order of
 * equal elements. The iteratees are invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {...(Array|Array[]|Function|Function[]|Object|Object[]|string|string[])}
 *  [iteratees=[_.identity]] The iteratees to sort by.
 * @returns {Array} Returns the new sorted array.
 * @example
 *
 * var users = [
 *   { 'user': 'fred',   'age': 48 },
 *   { 'user': 'barney', 'age': 36 },
 *   { 'user': 'fred',   'age': 40 },
 *   { 'user': 'barney', 'age': 34 }
 * ];
 *
 * _.sortBy(users, function(o) { return o.user; });
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
 *
 * _.sortBy(users, ['user', 'age']);
 * // => objects for [['barney', 34], ['barney', 36], ['fred', 40], ['fred', 48]]
 *
 * _.sortBy(users, 'user', function(o) {
 *   return Math.floor(o.age / 10);
 * });
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
 */
var sortBy = rest(function(collection, iteratees) {
  if (collection == null) {
    return [];
  }
  var length = iteratees.length;
  if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
    iteratees = [];
  } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
    iteratees = [iteratees[0]];
  }
  iteratees = (iteratees.length == 1 && isArray(iteratees[0]))
    ? iteratees[0]
    : baseFlatten(iteratees, 1, isFlattenableIteratee);

  return baseOrderBy(collection, iteratees, []);
});

module.exports = sortBy;

},{"./_baseFlatten":52,"./_baseOrderBy":73,"./_isFlattenableIteratee":130,"./_isIterateeCall":133,"./isArray":184,"./rest":212}],214:[function(require,module,exports){
/**
 * A method that returns a new empty array.
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

},{"../stringProcessing/sanitizeString.js":123,"lodash/defaults":284}],137:[function(require,module,exports){
/**
 * A method that returns `false`.
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

},{}],216:[function(require,module,exports){
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

},{"./_baseSum":78,"./identity":181}],217:[function(require,module,exports){
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

},{"./toNumber":219}],218:[function(require,module,exports){
var toFinite = require('./toFinite');

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
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

},{"./toFinite":217}],219:[function(require,module,exports){
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

},{"./isFunction":190,"./isObject":194,"./isSymbol":198}],220:[function(require,module,exports){
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

},{"./_copyObject":97,"./keysIn":202}],221:[function(require,module,exports){
var baseToString = require('./_baseToString');

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
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

},{"./_baseToString":80}],222:[function(require,module,exports){
var baseIteratee = require('./_baseIteratee'),
    baseUniq = require('./_baseUniq');

/**
 * This method is like `_.uniq` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the criterion by which
 * uniqueness is computed. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Array|Function|Object|string} [iteratee=_.identity]
 *  The iteratee invoked per element.
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
  return (array && array.length)
    ? baseUniq(array, baseIteratee(iteratee))
    : [];
}

module.exports = uniqBy;

},{"./_baseIteratee":65,"./_baseUniq":82}],223:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
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
    var timeout = setTimeout(cleanUpNextTick);
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
    clearTimeout(timeout);
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
        setTimeout(drainQueue, 0);
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

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],224:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],225:[function(require,module,exports){
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

},{}],138:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

var helpers = {
	scoreToRating: require( "./js/interpreters/scoreToRating" )
};

module.exports = {
	Assessor: require( "./js/assessor" ),
	SEOAssessor: require( "./js/seoAssessor" ),
	ContentAssessor: require( "./js/contentAssessor" ),
	App: require( "./js/app" ),
	Pluggable: require( "./js/pluggable" ),
	Researcher: require( "./js/researcher" ),
	SnippetPreview: require( "./js/snippetPreview.js" ),

},{"./_getNative":229,"./_root":269}],139:[function(require,module,exports){
var hashClear = require('./_hashClear'),
    hashDelete = require('./_hashDelete'),
    hashGet = require('./_hashGet'),
    hashHas = require('./_hashHas'),
    hashSet = require('./_hashSet');

/**
 * Default config for YoastSEO.js
 *
 * @type {Object}
 */
var defaults = {
	callbacks: {
		bindElementEvents: function( ) { },
		updateSnippetValues: function( ) { },
		saveScores: function( ) { },
		saveContentScore: function( ) { }
	},
	sampleText: {
		baseUrl: "example.org/",
		snippetCite: "example-post/",
		title: "This is an example title - edit by clicking here",
		keyword: "Choose a focus keyword",
		meta: "Modify your meta description by editing it right here",
		text: "Start writing your text!"
	},
	queue: [ "wordCount",
		"keywordDensity",
		"subHeadings",
		"stopwords",
		"fleschReading",
		"linkCount",
		"imageCount",
		"urlKeyword",
		"urlLength",
		"metaDescription",
		"pageTitleKeyword",
		"pageTitleLength",
		"firstParagraph",
		"'keywordDoubles" ],
	typeDelay: 300,
	typeDelayStep: 100,
	maxTypeDelay: 1500,
	dynamicDelay: true,
	locale: "en_US",
	translations: {
		"domain": "js-text-analysis",
		"locale_data": {
			"js-text-analysis": {
				"": {}
			}
		}
	},
	replaceTarget: [],
	resetTarget: [],
	elementTarget: [],
	marker: function() {}
};

/**
 * Creates a default snippet preview, this can be used if no snippet preview has been passed.
 *
 * @private
 * @this App
 *
 * @returns {SnippetPreview} The SnippetPreview object.
 */
function createDefaultSnippetPreview() {
	var targetElement = document.getElementById( this.config.targets.snippet );

	return new SnippetPreview( {
		analyzerApp: this,
		targetElement: targetElement,
		callbacks: {
			saveSnippetData: this.config.callbacks.saveSnippetData
		}
	} );
}

/**
 * Returns whether or not the given argument is a valid SnippetPreview object.
 *
 * @param   {*}         snippetPreview  The 'object' to check against.
 * @returns {boolean}                   Whether or not it's a valid SnippetPreview object.
 */
function isValidSnippetPreview( snippetPreview ) {
	return !isUndefined( snippetPreview ) && SnippetPreview.prototype.isPrototypeOf( snippetPreview );
}

/**
 * Check arguments passed to the App to check if all necessary arguments are set.
 *
 * @private
 * @param {Object}      args            The arguments object passed to the App.
 * @returns {void}
 */
function verifyArguments( args ) {

},{"./_hashClear":235,"./_hashDelete":236,"./_hashGet":237,"./_hashHas":238,"./_hashSet":239}],140:[function(require,module,exports){
var listCacheClear = require('./_listCacheClear'),
    listCacheDelete = require('./_listCacheDelete'),
    listCacheGet = require('./_listCacheGet'),
    listCacheHas = require('./_listCacheHas'),
    listCacheSet = require('./_listCacheSet');

/**
 * This should return an object with the given properties
 *
 * @callback YoastSEO.App~getData
 * @returns {Object} data
 * @returns {String} data.keyword The keyword that should be used
 * @returns {String} data.meta
 * @returns {String} data.text The text to analyze
 * @returns {String} data.metaTitle The text in the HTML title tag
 * @returns {String} data.title The title to analyze
 * @returns {String} data.url The URL for the given page
 * @returns {String} data.excerpt Excerpt for the pages
 */

/**
 * @callback YoastSEO.App~getAnalyzerInput
 *
 * @returns {Array} An array containing the analyzer queue
 */

},{"./_listCacheClear":255,"./_listCacheDelete":256,"./_listCacheGet":257,"./_listCacheHas":258,"./_listCacheSet":259}],141:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/**
 * @callback YoastSEO.App~updateSnippetValues
 *
 * @param {Object} ev The event emitted from the DOM
 */

/**
 * @callback YoastSEO.App~saveScores
 *
 * @param {int} score The overall keyword score as determined by the assessor.
 * @param {AssessorPresenter} assessorPresenter The assessor presenter that will be used to render the keyword score.
 */

},{"./_getNative":229,"./_root":269}],142:[function(require,module,exports){
var mapCacheClear = require('./_mapCacheClear'),
    mapCacheDelete = require('./_mapCacheDelete'),
    mapCacheGet = require('./_mapCacheGet'),
    mapCacheHas = require('./_mapCacheHas'),
    mapCacheSet = require('./_mapCacheSet');

/**
 * Loader for the analyzer, loads the eventbinder and the elementdefiner
 *
 * @param {Object} args The arguments oassed to the loader.
 * @param {Object} args.translations Jed compatible translations.
 * @param {Object} args.targets Targets to retrieve or set on.
 * @param {String} args.targets.snippet ID for the snippet preview element.
 * @param {String} args.targets.output ID for the element to put the output of the analyzer in.
 * @param {int} args.typeDelay Number of milliseconds to wait between typing to refresh the analyzer output.
 * @param {boolean} args.dynamicDelay   Whether to enable dynamic delay, will ignore type delay if the analyzer takes a long time.
 *                                      Applicable on slow devices.
 * @param {int} args.maxTypeDelay The maximum amount of type delay even if dynamic delay is on.
 * @param {int} args.typeDelayStep The amount with which to increase the typeDelay on each step when dynamic delay is enabled.
 * @param {Object} args.callbacks The callbacks that the app requires.
 * @param {Object} args.assessor The Assessor to use instead of the default assessor.
 * @param {YoastSEO.App~getData} args.callbacks.getData Called to retrieve input data
 * @param {YoastSEO.App~getAnalyzerInput} args.callbacks.getAnalyzerInput Called to retrieve input for the analyzer.
 * @param {YoastSEO.App~bindElementEvents} args.callbacks.bindElementEvents Called to bind events to the DOM elements.
 * @param {YoastSEO.App~updateSnippetValues} args.callbacks.updateSnippetValues Called when the snippet values need to be updated.
 * @param {YoastSEO.App~saveScores} args.callbacks.saveScores Called when the score has been determined by the analyzer.
 * @param {YoastSEO.App~saveContentScore} args.callback.saveContentScore Called when the content score has been
 *                                                                       determined by the assessor.
 * @param {Function} args.callbacks.saveSnippetData Function called when the snippet data is changed.
 * @param {Function} args.marker The marker to use to apply the list of marks retrieved from an assessment.
 *
 * @param {SnippetPreview} args.snippetPreview The SnippetPreview object to be used.
 *
 * @constructor
 */
var App = function( args ) {
	if ( !isObject( args ) ) {
		args = {};
	}

	defaultsDeep( args, defaults );

	verifyArguments( args );

},{"./_mapCacheClear":260,"./_mapCacheDelete":261,"./_mapCacheGet":262,"./_mapCacheHas":263,"./_mapCacheSet":264}],143:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

	this.callbacks = this.config.callbacks;
	this.i18n = this.constructI18n( this.config.translations );

	// Set the assessor
	if ( isUndefined( args.seoAssessor ) ) {
		this.seoAssessor = new SEOAssessor( this.i18n, { marker: this.config.marker } );
	} else {
		this.seoAssessor = args.seoAssessor;
	}

},{"./_getNative":229,"./_root":269}],144:[function(require,module,exports){
var root = require('./_root');

	this.pluggable = new Pluggable( this );

	this.getData();
	this.showLoadingDialog();

},{"./_root":269}],145:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

		/* Hack to make sure the snippet preview always has a reference to this App. This way we solve the circular
		dependency issue. In the future this should be solved by the snippet preview not having a reference to the
		app.*/
		if ( this.snippetPreview.refObj !== this ) {
			this.snippetPreview.refObj = this;
			this.snippetPreview.i18n = this.i18n;
		}
	} else {
		this.snippetPreview = createDefaultSnippetPreview.call( this );
	}
	this.initSnippetPreview();
	this.initAssessorPresenters();

	// Overwrite refresh function to make sure it can be debounced.
	this.refresh = debounce( this.refresh.bind( this ), this.config.typeDelay );

},{"./_getNative":229,"./_root":269}],146:[function(require,module,exports){
var MapCache = require('./_MapCache'),
    setCacheAdd = require('./_setCacheAdd'),
    setCacheHas = require('./_setCacheHas');

/**
 * Extend the config with defaults.
 *
 * @param   {Object}    args    The arguments to be extended.
 * @returns {Object}    args    The extended arguments.
 */
App.prototype.extendConfig = function( args ) {
	args.sampleText = this.extendSampleText( args.sampleText );
	args.locale = args.locale || "en_US";

	return args;
};

/**
 * Extend sample text config with defaults.
 *
 * @param   {Object}    sampleText  The sample text to be extended.
 * @returns {Object}    sampleText  The extended sample text.
 */
App.prototype.extendSampleText = function( sampleText ) {
	var defaultSampleText = defaults.sampleText;

	if ( isUndefined( sampleText ) ) {
		sampleText = defaultSampleText;
	} else {
		for ( var key in sampleText ) {
			if ( isUndefined( sampleText[ key ] ) ) {
				sampleText[ key ] = defaultSampleText[ key ];
			}
		}
	}

},{"./_MapCache":142,"./_setCacheAdd":270,"./_setCacheHas":271}],147:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    stackClear = require('./_stackClear'),
    stackDelete = require('./_stackDelete'),
    stackGet = require('./_stackGet'),
    stackHas = require('./_stackHas'),
    stackSet = require('./_stackSet');

/**
 * Initializes i18n object based on passed configuration
 *
 * @param {Object}  translations    The translations to be used in the current instance.
 * @returns {void}
 */
App.prototype.constructI18n = function( translations ) {
	var defaultTranslations = {
		"domain": "js-text-analysis",
		"locale_data": {
			"js-text-analysis": {
				"": {}
			}
		}
	};

	// Use default object to prevent Jed from erroring out.
	translations = translations || defaultTranslations;

},{"./_ListCache":140,"./_stackClear":273,"./_stackDelete":274,"./_stackGet":275,"./_stackHas":276,"./_stackSet":277}],148:[function(require,module,exports){
var root = require('./_root');

/**
 * Retrieves data from the callbacks.getData and applies modification to store these in this.rawData.
 * @returns {void}
 */
App.prototype.getData = function() {
	this.rawData = this.callbacks.getData();

	if ( !isUndefined( this.snippetPreview ) ) {

},{"./_root":269}],149:[function(require,module,exports){
var root = require('./_root');

		this.rawData.metaTitle = data.title;
		this.rawData.url = data.url;
		this.rawData.meta = data.metaDesc;
	}

	if ( this.pluggable.loaded ) {
		this.rawData.metaTitle = this.pluggable._applyModifications( "data_page_title", this.rawData.metaTitle );
		this.rawData.meta = this.pluggable._applyModifications( "data_meta_desc", this.rawData.meta );
	}
	this.rawData.locale = this.config.locale;
};

},{"./_root":269}],150:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/**
 * Creates the elements for the snippetPreview
 *
 * @deprecated Don't create a snippet preview using this method, create it directly using the prototype and pass it as
 * an argument instead.
 * @returns {void}
 */
App.prototype.createSnippetPreview = function() {
	this.snippetPreview = createDefaultSnippetPreview.call( this );
	this.initSnippetPreview();
};

/**
 * Initializes the snippet preview for this App.
 * @returns {void}
 */
App.prototype.initSnippetPreview = function() {
	this.snippetPreview.renderTemplate();
	this.snippetPreview.callRegisteredEventBinder();
	this.snippetPreview.bindEvents();
	this.snippetPreview.init();
};

},{"./_getNative":229,"./_root":269}],151:[function(require,module,exports){
/**
 * Initializes the assessorpresenters for content and SEO.
 */
App.prototype.initAssessorPresenters = function() {

	// Pass the assessor result through to the formatter
	this.seoAssessorPresenter = new AssessorPresenter( {
		targets: {
			output: this.config.targets.output
		},
		assessor: this.seoAssessor,
		i18n: this.i18n
	} );

	if ( !isUndefined( this.config.targets.contentOutput ) ) {
		// Pass the assessor result through to the formatter
		this.contentAssessorPresenter = new AssessorPresenter( {
			targets: {
				output: this.config.targets.contentOutput
			},
			assessor: this.contentAssessor,
			i18n: this.i18n
		} );
	}
};

},{}],152:[function(require,module,exports){
/**
 * Binds the refresh function to the input of the targetElement on the page.
 * @returns {void}
 */
App.prototype.bindInputEvent = function() {
	for ( var i = 0; i < this.config.elementTarget.length; i++ ) {
		var elem = document.getElementById( this.config.elementTarget[ i ] );
		elem.addEventListener( "input", this.refresh.bind( this ) );
	}
};

/**
 * Runs the rerender function of the snippetPreview if that object is defined.
 * @returns {void}
 */
App.prototype.reloadSnippetText = function() {
	if ( isUndefined( this.snippetPreview ) ) {
		this.snippetPreview.reRender();
	}
};

},{}],153:[function(require,module,exports){
/**
 * Sets the startTime timestamp
 * @returns {void}
 */
App.prototype.startTime = function() {
	this.startTimestamp = new Date().getTime();
};

/**
 * Sets the endTime timestamp and compares with startTime to determine typeDelayincrease.
 * @returns {void}
 */
App.prototype.endTime = function() {
	this.endTimestamp = new Date().getTime();
	if ( this.endTimestamp - this.startTimestamp > this.config.typeDelay ) {
		if ( this.config.typeDelay < ( this.config.maxTypeDelay - this.config.typeDelayStep ) ) {
			this.config.typeDelay += this.config.typeDelayStep;
		}
	}
};

},{}],154:[function(require,module,exports){
/**
 * Inits a new pageAnalyzer with the inputs from the getInput function and calls the scoreFormatter
 * to format outputs.
 * @returns {void}
 */
App.prototype.runAnalyzer = function() {
	if ( this.pluggable.loaded === false ) {
		return;
	}

	if ( this.config.dynamicDelay ) {
		this.startTime();
	}

	this.analyzerData = this.modifyData( this.rawData );

	// Create a paper object for the Researcher
	this.paper = new Paper( this.analyzerData.text, {
		keyword:  this.analyzerData.keyword,
		description: this.analyzerData.meta,
		url: this.analyzerData.url,
		title: this.analyzerData.metaTitle,
		locale: this.config.locale
	} );

	// The new researcher
	if ( isUndefined( this.researcher ) ) {
		this.researcher = new Researcher( this.paper );
	} else {
		this.researcher.setPaper( this.paper );
	}

	this.seoAssessor.assess( this.paper );
	this.contentAssessor.assess( this.paper );

	this.seoAssessorPresenter.setKeyword( this.paper.getKeyword() );
	this.seoAssessorPresenter.render();
	this.callbacks.saveScores( this.seoAssessor.calculateOverallScore(), this.seoAssessorPresenter );

	if ( !isUndefined( this.contentAssessorPresenter ) ) {
		this.contentAssessorPresenter.renderIndividualRatings();
		this.callbacks.saveContentScore( this.contentAssessor.calculateOverallScore(), this.contentAssessorPresenter );
	}

	if ( this.config.dynamicDelay ) {
		this.endTime();
	}

	this.snippetPreview.reRender();
};

},{}],155:[function(require,module,exports){
/**
 * Modifies the data with plugins before it is sent to the analyzer.
 * @param   {Object}  data      The data to be modified.
 * @returns {Object}            The data with the applied modifications.
 */
App.prototype.modifyData = function( data ) {

	// Copy rawdata to lose object reference.
	data = JSON.parse( JSON.stringify( data ) );

	data.text      = this.pluggable._applyModifications( "content", data.text );
	data.metaTitle = this.pluggable._applyModifications( "title", data.metaTitle );

},{}],156:[function(require,module,exports){
var baseIndexOf = require('./_baseIndexOf');

/**
 * Function to fire the analyzer when all plugins are loaded, removes the loading dialog.
 * @returns {void}
 */
App.prototype.pluginsLoaded = function() {
	this.getData();
	this.removeLoadingDialog();
	this.runAnalyzer();
};

/**
 * Shows the loading dialog which shows the loading of the plugins.
 * @returns {void}
 */
App.prototype.showLoadingDialog = function() {
	var dialogDiv = document.createElement( "div" );
	dialogDiv.className = "YoastSEO_msg";
	dialogDiv.id = "YoastSEO-plugin-loading";
	document.getElementById( this.config.targets.output ).appendChild( dialogDiv );
};

},{"./_baseIndexOf":181}],157:[function(require,module,exports){
/**
 * Updates the loading plugins. Uses the plugins as arguments to show which plugins are loading
 * @param   {Object}  plugins   The plugins to be parsed into the dialog.
 * @returns {void}
 */
App.prototype.updateLoadingDialog = function( plugins ) {
	var dialog = document.getElementById( "YoastSEO-plugin-loading" );
	dialog.textContent = "";
	forEach( plugins, function( plugin, pluginName ) {
		dialog.innerHTML += "<span class=left>" + pluginName + "</span><span class=right " +
							plugin.status + ">" + plugin.status + "</span><br />";
	} );
	dialog.innerHTML += "<span class=bufferbar></span>";
};

/**
 * Removes the pluging load dialog.
 * @returns {void}
 */
App.prototype.removeLoadingDialog = function() {
	document.getElementById( this.config.targets.output ).removeChild( document.getElementById( "YoastSEO-plugin-loading" ) );
};

// ***** PLUGGABLE PUBLIC DSL ***** //

},{}],158:[function(require,module,exports){
/**
 * Delegates to `YoastSEO.app.pluggable.registerPlugin`
 *
 * @param {string}  pluginName      The name of the plugin to be registered.
 * @param {object}  options         The options object.
 * @param {string}  options.status  The status of the plugin being registered. Can either be "loading" or "ready".
 * @returns {boolean}               Whether or not it was successfully registered.
 */
App.prototype.registerPlugin = function( pluginName, options ) {
	return this.pluggable._registerPlugin( pluginName, options );
};

},{}],159:[function(require,module,exports){
/**
 * Delegates to `YoastSEO.app.pluggable.ready`
 *
 * @param {string}  pluginName  The name of the plugin to check.
 * @returns {boolean}           Whether or not the plugin is ready.
 */
App.prototype.pluginReady = function( pluginName ) {
	return this.pluggable._ready( pluginName );
};

},{}],160:[function(require,module,exports){
/**
 * Delegates to `YoastSEO.app.pluggable.reloaded`
 *
 * @param {string} pluginName   The name of the plugin to reload
 * @returns {boolean}           Whether or not the plugin was reloaded.
 */
App.prototype.pluginReloaded = function( pluginName ) {
	return this.pluggable._reloaded( pluginName );
};

},{}],161:[function(require,module,exports){
/**
 * Delegates to `YoastSEO.app.pluggable.registerModification`
 *
 * @param {string}      modification 		The name of the filter
 * @param {function}    callable 		 	The callable function
 * @param {string}      pluginName 		    The plugin that is registering the modification.
 * @param {number}      priority 		 	(optional) Used to specify the order in which the callables associated with a particular filter are
                                            called.
 * 									        Lower numbers correspond with earlier execution.
 * @returns 			{boolean}           Whether or not the modification was successfully registered.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;

},{}],162:[function(require,module,exports){
var eq = require('./eq');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Registers a custom test for use in the analyzer, this will result in a new line in the analyzer results. The function
 * has to return a result based on the contents of the page/posts.
 *
 * The scoring object is a special object with definitions about how to translate a result from your analysis function
 * to a SEO score.
 *
 * Negative scores result in a red circle
 * Scores 1, 2, 3, 4 and 5 result in a orange circle
 * Scores 6 and 7 result in a yellow circle
 * Scores 8, 9 and 10 result in a red circle
 *
 * @deprecated since version 1.2
 */
function assignInDefaults(objValue, srcValue, key, object) {
  if (objValue === undefined ||
      (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
    return srcValue;
  }
  return objValue;
}

module.exports = assignInDefaults;

},{"./eq":287}],163:[function(require,module,exports){
var eq = require('./eq');

/**
 * Registers a custom assessment for use in the analyzer, this will result in a new line in the analyzer results.
 * The function needs to use the assessmentresult to return an result  based on the contents of the page/posts.
 *
 * Score 0 results in a grey circle if it is not explicitly set by using setscore
 * Scores 0, 1, 2, 3 and 4 result in a red circle
 * Scores 6 and 7 result in a yellow circle
 * Scores 8, 9 and 10 result in a green circle
 *
 * @param {string} name Name of the test.
 * @param {function} assessment The assessment to run
 * @param {string}   pluginName The plugin that is registering the test.
 * @returns {boolean} Whether or not the test was successfully registered.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq(object[key], value)) ||
      (typeof key == 'number' && value === undefined && !(key in object))) {
    object[key] = value;
  }
}

module.exports = assignMergeValue;

},{"./eq":287}],164:[function(require,module,exports){
var eq = require('./eq');

/** Used for built-in method references. */
var objectProto = Object.prototype;

// Deprecated functions

/**
 * The analyzeTimer calls the checkInputs function with a delay, so the function won't be executed
 * at every keystroke checks the reference object, so this function can be called from anywhere,
 * without problems with different scopes.
 *
 * @deprecated: 1.3 - Use this.refresh() instead.
 *
 * @returns {void}
 */
App.prototype.analyzeTimer = function() {
	this.refresh();
};

module.exports = App;

},{"./eq":287}],165:[function(require,module,exports){
var eq = require('./eq');

/**
 * Checks for too long sentences.
 * @param {array} sentences The array containing sentence lengths.
 * @param {number} recommendedValue The recommended maximum length of sentence.
 * @returns {array} Array of too long sentences.
 */
module.exports = function( sentences, recommendedValue ) {
	var tooLongSentences = filter( sentences, function( sentence ) {
		return isSentenceTooLong( recommendedValue, sentence.sentenceLength );
	} );

},{"./eq":287}],166:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    keys = require('./keys');

},{"../helpers/isValueTooLong":278,"lodash/filter":173}],229:[function(require,module,exports){
/**
 * Calculates the score based on the percentage of too long sentences.
 * @param {number} percentage The percentage of too long sentences
 * @returns {number} The score
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;

},{"./_copyObject":215,"./keys":316}],167:[function(require,module,exports){
var Stack = require('./_Stack'),
    arrayEach = require('./_arrayEach'),
    assignValue = require('./_assignValue'),
    baseAssign = require('./_baseAssign'),
    cloneBuffer = require('./_cloneBuffer'),
    copyArray = require('./_copyArray'),
    copySymbols = require('./_copySymbols'),
    getAllKeys = require('./_getAllKeys'),
    getTag = require('./_getTag'),
    initCloneArray = require('./_initCloneArray'),
    initCloneByTag = require('./_initCloneByTag'),
    initCloneObject = require('./_initCloneObject'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isHostObject = require('./_isHostObject'),
    isObject = require('./isObject'),
    keys = require('./keys');

	// Scale percentages from 21.7 to 31.7 to a score. 21.7 scores 9, 31.7 score 3.
	// We use 10 steps (between 9 and 3), so each step is 0.6
	var unboundedScore = 9 - ( 0.6 ) * ( percentage - 21.7 );

	// Scores exceeding 9 are 9, scores below 3 are 3.
	return Math.max( Math.min( unboundedScore, 9 ), 3 );
};

},{}],230:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var inRange = require( "lodash/inRange" );

/**
 * Calculates the assessment result based on the fleschReadingScore
 * @param {int} fleschReadingScore The score from the fleschReadingtest
 * @param {object} i18n The i18n-object used for parsing translations
 * @returns {object} object with score, resultText and note
 */
var calculateFleschReadingResult = function( fleschReadingScore, i18n ) {
	if ( fleschReadingScore > 90 ) {
		return {
			score: 9,
			resultText: i18n.dgettext( "js-text-analysis", "very easy" ),
			note: ""
		};
	}

	if ( inRange( fleschReadingScore, 80, 90 ) ) {
		return {
			score: 9,
			resultText:  i18n.dgettext( "js-text-analysis", "easy" ),
			note: ""
		};
	}

	if ( inRange( fleschReadingScore, 70, 80 ) ) {
		return {
			score: 8,
			resultText: i18n.dgettext( "js-text-analysis", "fairly easy" ),
			note: ""
		};
	}

	if ( inRange( fleschReadingScore, 60, 70 ) ) {
		return {
			score: 8,
			resultText: i18n.dgettext( "js-text-analysis", "ok" ),
			note: ""
		};
	}

	if ( inRange( fleschReadingScore, 50, 60 ) ) {
		return {
			score: 6,
			resultText: i18n.dgettext( "js-text-analysis", "fairly difficult" ),
			note: i18n.dgettext( "js-text-analysis", "Try to make shorter sentences to improve readability." )
		};
	}

},{"./_Stack":147,"./_arrayEach":154,"./_assignValue":164,"./_baseAssign":166,"./_cloneBuffer":207,"./_copyArray":214,"./_copySymbols":216,"./_getAllKeys":225,"./_getTag":232,"./_initCloneArray":242,"./_initCloneByTag":243,"./_initCloneObject":244,"./_isHostObject":246,"./isArray":299,"./isBuffer":302,"./isObject":309,"./keys":316}],168:[function(require,module,exports){
var isObject = require('./isObject');

	if ( fleschReadingScore < 30 ) {
		return {
			score: 4,
			resultText: i18n.dgettext( "js-text-analysis", "very difficult" ),
			note: i18n.dgettext( "js-text-analysis", "Try to make shorter sentences, using less difficult words to improve readability." )
		};
	}
};

/**
 * The assessment that runs the FleschReading on the paper.
 *
 * @param {object} paper The paper to run this assessment on
 * @param {object} researcher The researcher used for the assessment
 * @param {object} i18n The i18n-object used for parsing translations
 * @returns {object} an assessmentresult with the score and formatted text.
 */
function baseCreate(proto) {
  return isObject(proto) ? objectCreate(proto) : {};
}

module.exports = baseCreate;

},{"./isObject":309}],169:[function(require,module,exports){
var SetCache = require('./_SetCache'),
    arrayIncludes = require('./_arrayIncludes'),
    arrayIncludesWith = require('./_arrayIncludesWith'),
    arrayMap = require('./_arrayMap'),
    baseUnary = require('./_baseUnary'),
    cacheHas = require('./_cacheHas');

	/* translators: %1$s expands to the numeric flesch reading ease score, %2$s to a link to a Yoast.com article about Flesch ease reading score,
	 %3$s to the easyness of reading, %4$s expands to a note about the flesch reading score. */
	var text = i18n.dgettext( "js-text-analysis", "The copy scores %1$s in the %2$s test, which is considered %3$s to read. %4$s" );
	var url = "<a href='https://yoast.com/flesch-reading-ease-score/' target='new'>Flesch Reading Ease</a>";

	// scores must be between 0 and 100;
	if ( fleschReadingScore < 0 ) {
		fleschReadingScore = 0;
	}
	if ( fleschReadingScore > 100 ) {
		fleschReadingScore = 100;
	}

	var fleschReadingResult = calculateFleschReadingResult( fleschReadingScore, i18n );

	text = i18n.sprintf( text, fleschReadingScore, url, fleschReadingResult.resultText, fleschReadingResult.note );

	var assessmentResult =  new AssessmentResult();
	assessmentResult.setScore( fleschReadingResult.score );
	assessmentResult.setText( text );

},{"./_SetCache":146,"./_arrayIncludes":156,"./_arrayIncludesWith":157,"./_arrayMap":158,"./_baseUnary":200,"./_cacheHas":203}],170:[function(require,module,exports){
var baseForOwn = require('./_baseForOwn'),
    createBaseEach = require('./_createBaseEach');

module.exports = {
	identifier: "fleschReadingEase",
	getResult: fleschReadingEaseAssessment,
	isApplicable: function( paper ) {
		return ( paper.getLocale().indexOf( "en_" ) > -1 && paper.hasText() );
	}
};

},{"../values/AssessmentResult.js":361,"lodash/inRange":182}],231:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var fixFloatingPoint = require( "../helpers/fixFloatingPoint.js" );
var getSubheadings = require( "../stringProcessing/getSubheadings.js" ).getSubheadings;
var Mark = require( "../values/Mark.js" );
var marker = require( "../markers/addMark.js" );

},{"./_baseForOwn":175,"./_createBaseEach":219}],171:[function(require,module,exports){
var baseEach = require('./_baseEach');

/**
 * Calculates the result based on the score from the researcher.
 * @param {number} score The lowest score of the subheadings.
 * @param {number} tooLongHeaders The number of subheadings that are too long.
 * @param {number} recommendedValue The recommended maximum length for subheadings.
 * @param {object} i18n The object used for translations.
 * @returns {object} resultObject with text and score.
 */
var subheadingsLengthScore = function( score, tooLongHeaders, recommendedValue, i18n ) {
	if ( score === 0 ) {
		return {};
	}

	if( score >= 7 ) {
		return {
			score: score,
			hasMarks: false,
			text: i18n.sprintf(
				i18n.dgettext(
					"js-text-analysis",
					// translators: %1$d expands to the recommended maximum number of characters.
					"The length of all subheadings is less than or equal to the recommended maximum of %1$d characters, which is great."
				), recommendedValue
			)
		};
	}

	return {
		score: score,
		hasMarks: true,
		text: i18n.sprintf(
			i18n.dngettext(
				"js-text-analysis",
				// translators: %1$d expands to the number of subheadings. %2$d expands to the recommended maximum number of characters.
				"You have %1$d subheading containing more than the recommended maximum of %2$d characters.",
				"You have %1$d subheadings containing more than the recommended maximum of %2$d characters.",
				tooLongHeaders
			), tooLongHeaders, recommendedValue
		)
	};
};

},{"./_baseEach":170}],172:[function(require,module,exports){
/**
 * Runs the getSubheadingLength research and checks scores based on length.
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessmentresult
 */
var getSubheadingLength = function( paper, researcher, i18n ) {
	var subheadingsLength = researcher.getResearch( "getSubheadingLength" );
	var recommendedValue = 30;
	var tooLong = 0;
	var scores = [];
	var lowestScore = 0;

	if ( subheadingsLength.length > 0 ) {
		forEach( subheadingsLength, function( length ) {
			if( length > recommendedValue ) {
				tooLong++;
			}

			// 6 is the number of scorepoints between 3, minscore and 9, maxscore. For scoring we use 20 steps, each step is 0.3.
			// Up to 23.4  is for scoring a 9, higher numbers give lower scores.
			scores.push( 9 - Math.max( Math.min( ( 0.3 ) * ( length - 23.4 ), 6 ), 0 ) );
		} );

},{}],173:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    isFlattenable = require('./_isFlattenable');

	// floatingPointFix because of js rounding errors
	lowestScore = fixFloatingPoint( lowestScore );

	var subheadingsLengthResult = subheadingsLengthScore( lowestScore, tooLong, recommendedValue, i18n );

	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( subheadingsLengthResult.score );
	assessmentResult.setText( subheadingsLengthResult.text );
	assessmentResult.setHasMarks( subheadingsLengthResult.hasMarks );

},{"./_arrayPush":159,"./_isFlattenable":245}],174:[function(require,module,exports){
var createBaseFor = require('./_createBaseFor');

/**
 * Marks text for the subheading length assessment
 *
 * @param {Paper} paper The paper that should be marked.
 * @returns {Array<Mark>} A list of marks that should be applied.
 */
function subheadingLengthMarker( paper ) {
	var subheadings = getSubheadings( paper.getText() );

	var lengthySubheadings = filter( subheadings, function( subheading ) {
		return subheading[ 2 ].length > 30;
	} );

},{"./_createBaseFor":220}],175:[function(require,module,exports){
var baseFor = require('./_baseFor'),
    keys = require('./keys');

		var marked = outerText.replace( innerText, marker( innerText ) );

		return new Mark( {
			original: outerText,
			marked: marked
		} );
	} );
}

module.exports = {
	identifier: "textSubheadingLength",
	getResult: getSubheadingLength,
	isApplicable: function( paper ) {
		return paper.hasText();
	},
	getMarks: subheadingLengthMarker
};

},{"./_baseFor":174,"./keys":316}],176:[function(require,module,exports){
var castPath = require('./_castPath'),
    isKey = require('./_isKey'),
    toKey = require('./_toKey');

/**
 * Returns a score and text based on the firstParagraph object.
 *
 * @param {object} firstParagraphMatches The object with all firstParagraphMatches.
 * @param {object} i18n The object used for translations
 * @returns {object} resultObject with score and text
 */
var calculateFirstParagraphResult = function( firstParagraphMatches, i18n ) {
	if ( firstParagraphMatches > 0 ) {
		return {
			score: 9,
			text: i18n.dgettext( "js-text-analysis", "The focus keyword appears in the first paragraph of the copy." )
		};
	}

},{"./_castPath":204,"./_isKey":249,"./_toKey":279}],177:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    isArray = require('./isArray');

/**
 * Runs the findKeywordInFirstParagraph module, based on this returns an assessment result with score.
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var introductionHasKeywordAssessment = function( paper, researcher, i18n ) {
	var firstParagraphMatches = researcher.getResearch( "firstParagraph" );
	var firstParagraphResult = calculateFirstParagraphResult( firstParagraphMatches, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( firstParagraphResult.score );
	assessmentResult.setText( firstParagraphResult.text );

},{"./_arrayPush":159,"./isArray":299}],178:[function(require,module,exports){
var getPrototype = require('./_getPrototype');

module.exports = {
	identifier: "introductionKeyword",
	getResult: introductionHasKeywordAssessment,
	isApplicable: function( paper ) {
		return paper.hasKeyword();
	}
};

},{"../values/AssessmentResult.js":361}],233:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Assesses the keyphrase presence and length
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {Researcher} researcher The researcher used for calling research.
 * @param {Jed} i18n The object used for translations
 * @returns {AssessmentResult} The result of this assessment
*/
function keyphraseAssessment( paper, researcher, i18n ) {
	var keyphraseLength = researcher.getResearch( "keyphraseLength" );

	var assessmentResult = new AssessmentResult();

},{"./_getPrototype":230}],179:[function(require,module,exports){
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

module.exports = {
	identifier: "keyphraseLength",
	getResult: keyphraseAssessment
};

},{}],180:[function(require,module,exports){
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Returns the scores and text for keyword density
 *
 * @param {string} keywordDensity The keyword density
 * @param {object} i18n The i18n object used for translations
 * @param {number} keywordCount The number of times the keyword has been found in the text.
 * @returns {{score: number, text: *}} The assessment result
 */
var calculateKeywordDensityResult = function( keywordDensity, i18n, keywordCount ) {
	var score, text, max;

	var keywordDensityPercentage = keywordDensity.toFixed( 1 ) + "%";

},{}],181:[function(require,module,exports){
var indexOfNaN = require('./_indexOfNaN');

		/* translators: %1$s expands to the keyword density percentage, %2$d expands to the keyword count,
		%3$s expands to the maximum keyword density percentage. */
		text = i18n.dgettext( "js-text-analysis", "The keyword density is %1$s," +
			" which is way over the advised %3$s maximum;" +
			" the focus keyword was found %2$d times." );

		/* translators: This is the maximum keyword density, localize the number for your language (e.g. 2,5) */
		max = i18n.dgettext( "js-text-analysis", "2.5" ) + "%";

		text = i18n.sprintf( text, keywordDensityPercentage, keywordCount, max );
	}

	if ( inRange( keywordDensity, 2.5, 3.5 ) ) {
		score = -10;

		/* translators: %1$s expands to the keyword density percentage, %2$d expands to the keyword count,
		%3$s expands to the maximum keyword density percentage. */
		text = i18n.dgettext( "js-text-analysis", "The keyword density is %1$s," +
			" which is over the advised %3$s maximum;" +
			" the focus keyword was found %2$d times." );

},{"./_indexOfNaN":241}],182:[function(require,module,exports){
var baseIsEqualDeep = require('./_baseIsEqualDeep'),
    isObject = require('./isObject'),
    isObjectLike = require('./isObjectLike');

		text = i18n.sprintf( text, keywordDensityPercentage, keywordCount, max );
	}

	if ( inRange( keywordDensity, 0.5, 2.5 ) ) {
		score = 9;

},{"./_baseIsEqualDeep":183,"./isObject":309,"./isObjectLike":310}],183:[function(require,module,exports){
var Stack = require('./_Stack'),
    equalArrays = require('./_equalArrays'),
    equalByTag = require('./_equalByTag'),
    equalObjects = require('./_equalObjects'),
    getTag = require('./_getTag'),
    isArray = require('./isArray'),
    isHostObject = require('./_isHostObject'),
    isTypedArray = require('./isTypedArray');

		text = i18n.sprintf( text, keywordDensityPercentage, keywordCount );
	}

	if ( inRange( keywordDensity, 0, 0.5 ) ) {
		score = 4;

		/* translators: %1$s expands to the keyword density percentage, %2$d expands to the keyword count. */
		text = i18n.dgettext( "js-text-analysis", "The keyword density is %1$s, which is a bit low;" +
			" the focus keyword was found %2$d times." );

		text = i18n.sprintf( text, keywordDensityPercentage, keywordCount );
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
var keywordDensityAssessment = function( paper, researcher, i18n ) {

	var keywordDensity = researcher.getResearch( "getKeywordDensity" );
	var keywordCount = matchWords( paper.getText(), paper.getKeyword(), paper.getLocale() );

	var keywordDensityResult = calculateKeywordDensityResult( keywordDensity, i18n, keywordCount );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( keywordDensityResult.score );
	assessmentResult.setText( keywordDensityResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "keywordDensity",
	getResult: keywordDensityAssessment,
	isApplicable: function( paper ) {
		return paper.hasText() && paper.hasKeyword() && countWords( paper.getText() ) >= 100;
	}
};

},{"./_Stack":147,"./_equalArrays":222,"./_equalByTag":223,"./_equalObjects":224,"./_getTag":232,"./_isHostObject":246,"./isArray":299,"./isTypedArray":314}],184:[function(require,module,exports){
var Stack = require('./_Stack'),
    baseIsEqual = require('./_baseIsEqual');

/**
 * Calculate the score based on the amount of stop words in the keyword.
 * @param {number} stopWordCount The amount of stop words to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var calculateStopWordsCountResult = function( stopWordCount, i18n ) {

	if ( stopWordCount > 0 ) {
		return {
			score: 0,
			text: i18n.dngettext(
				"js-text-analysis",
				/* translators: %1$s opens a link to a Yoast article about stop words, %2$s closes the link */
				"Your focus keyword contains a stop word. This may or may not be wise depending on the circumstances. " +
				"Read %1$sthis article%2$s for more info.",
				"Your focus keyword contains %3$d stop words. This may or may not be wise depending on the circumstances. " +
				"Read %1$sthis article%2$s for more info.",
				stopWordCount
			)
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
var keywordHasStopWordsAssessment = function( paper, researcher, i18n ) {
	var stopWords = researcher.getResearch( "stopWordsInKeyword" );
	var stopWordsResult = calculateStopWordsCountResult( stopWords.length, i18n );

	var assessmentResult = new AssessmentResult();
	assessmentResult.setScore( stopWordsResult.score );
	assessmentResult.setText( i18n.sprintf(
		stopWordsResult.text,
		"<a href='https://yoast.com/handling-stopwords/' target='new'>",
		"</a>",
		stopWords.length
	) );

	return assessmentResult;
};

module.exports = {
	identifier: "keywordStopWords",
	getResult: keywordHasStopWordsAssessment,
	isApplicable: function ( paper ) {
		return paper.hasKeyword();
	}
};

},{"./_Stack":147,"./_baseIsEqual":182}],185:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isHostObject = require('./_isHostObject'),
    isMasked = require('./_isMasked'),
    isObject = require('./isObject'),
    toSource = require('./_toSource');

/**
 * Returns the score and text for the description keyword match.
 * @param {number} keywordMatches The number of keyword matches in the description.
 * @param {object} i18n The i18n object used for translations.
 * @returns {Object} An object with values for the assessment result.
 */
var calculateKeywordMatchesResult = function( keywordMatches, i18n ) {
	if ( keywordMatches > 0 ) {
		return {
			score: 9,
			text: i18n.dgettext( "js-text-analysis", "The meta description contains the focus keyword." )
		};
	}
	if ( keywordMatches === 0 ) {
		return {
			score: 3,
			text: i18n.dgettext( "js-text-analysis", "A meta description has been specified, but it does not contain the focus keyword." )
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
var metaDescriptionHasKeywordAssessment = function( paper, researcher, i18n ) {
	var keywordMatches = researcher.getResearch( "metaDescriptionKeyword" );
	var descriptionLengthResult = calculateKeywordMatchesResult( keywordMatches, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( descriptionLengthResult.score );
	assessmentResult.setText( descriptionLengthResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "metaDescriptionKeyword",
	getResult: metaDescriptionHasKeywordAssessment,
	isApplicable: function ( paper ) {
		return paper.hasKeyword();
	}
};

},{"../values/AssessmentResult.js":361}],237:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Returns the score and text for the descriptionLength
 * @param {number} descriptionLength The length of the metadescription.
 * @param {object} i18n The i18n object used for translations.
 * @returns {Object} An object with values for the assessment result.
 */
var calculateDescriptionLengthResult = function( descriptionLength, i18n ) {
	var recommendedValue = 120;
	var maximumValue = 156;
	if ( descriptionLength === 0 ) {
		return {
			score: 1,
			text: i18n.dgettext( "js-text-analysis", "No meta description has been specified, " +
				"search engines will display copy from the page instead." )
		};
	}
	if ( descriptionLength <= recommendedValue ) {
		return {
			score: 6,
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "The meta description is under %1$d characters, " +
				"however up to %2$d characters are available." ), recommendedValue, maximumValue )
		};
	}
	if ( descriptionLength > maximumValue ) {
		return {
			score: 6,
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "The specified meta description is over %1$d characters. " +
				"Reducing it will ensure the entire description is visible." ), maximumValue )
		};
	}
	if ( descriptionLength >= recommendedValue && descriptionLength <= maximumValue ) {
		return {
			score: 9,
			text: i18n.dgettext( "js-text-analysis", "In the specified meta description, consider: " +
				"How does it compare to the competition? Could it be made more appealing?" )
		};
	}
};

/**
 * Runs the metaDescriptionLength module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var metaDescriptionLengthAssessment = function( paper, researcher, i18n ) {
	var descriptionLength = researcher.getResearch( "metaDescriptionLength" );
	var descriptionLengthResult = calculateDescriptionLengthResult( descriptionLength, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( descriptionLengthResult.score );
	assessmentResult.setText( descriptionLengthResult.text );

},{"./_isHostObject":246,"./_isMasked":251,"./_toSource":280,"./isFunction":305,"./isObject":309}],186:[function(require,module,exports){
var baseMatches = require('./_baseMatches'),
    baseMatchesProperty = require('./_baseMatchesProperty'),
    identity = require('./identity'),
    isArray = require('./isArray'),
    property = require('./property');

/**
 * Returns an array containing only the paragraphs longer than the recommended length.
 * @param {array} paragraphsLength The array containing the lengths of individual paragraphs.
 * @returns {number} The number of too long paragraphs.
 */
var getTooLongParagraphs = function( paragraphsLength  ) {
	return filter( paragraphsLength, function( paragraph ) {
		return isParagraphTooLong( recommendedValue, paragraph.wordCount );
	} );
};

/**
 * Returns the scores and text for the ParagraphTooLongAssessment
 * @param {array} paragraphsLength The array containing the lengths of individual paragraphs.
 * @param {number} tooLongParagraphs The number of too long paragraphs.
 * @param {object} i18n The i18n object used for translations.
 * @returns {{score: number, text: string }} the assessmentResult.
 */
var calculateParagraphLengthResult = function( paragraphsLength, tooLongParagraphs, i18n ) {
	if ( paragraphsLength.length === 0 ) {
		return {};
	}
	// 6 is the number of scorepoints between 3, minscore and 9, maxscore. For scoring we use 100 steps, each step is 0.06.
	// Up to 117 is for scoring a 9, higher numbers give lower scores.
	// FloatingPointFix because of js rounding errors.
	var score = 9 - Math.max( Math.min( ( 0.06 ) * ( paragraphsLength[ 0 ].wordCount - 117 ), 6 ), 0 );
	score = fixFloatingPoint( score );
	if ( score >= 7 ) {
		return {
			score: score,
			hasMarks: false,
			text: i18n.dgettext( "js-text-analysis", "None of your paragraphs are too long, which is great." )
		};
	}
	return {
		score: score,
		hasMarks: true,

},{"./_baseMatches":190,"./_baseMatchesProperty":191,"./identity":295,"./isArray":299,"./property":325}],187:[function(require,module,exports){
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = Object.keys;

/**
 * Sort the paragraphs based on word count.
 *
 * @param {Array} paragraphs The array with paragraphs.
 * @returns {Array} The array sorted on word counts.
 */
var sortParagraphs = function( paragraphs ) {
	return paragraphs.sort(
		function( a, b ) {
			return b.wordCount - a.wordCount;
		}
	);
};

/**
 * Creates a marker for the paragraphs.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @returns {Array} An array with marked paragraphs.
 */
var paragraphLengthMarker = function( paper, researcher ) {
	var paragraphsLength = researcher.getResearch( "getParagraphLength" );
	var tooLongParagraphs = getTooLongParagraphs( paragraphsLength );
	return map( tooLongParagraphs, function( paragraph ) {
		var marked = marker( paragraph.paragraph );
		return new Mark( {
			original: paragraph.paragraph,
			marked: marked
		} );
	} );
};

},{}],188:[function(require,module,exports){
var Reflect = require('./_Reflect'),
    iteratorToArray = require('./_iteratorToArray');

	paragraphsLength = sortParagraphs( paragraphsLength );

	var tooLongParagraphs = getTooLongParagraphs( paragraphsLength );
	var paragraphLengthResult = calculateParagraphLengthResult( paragraphsLength, tooLongParagraphs, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( paragraphLengthResult.score );
	assessmentResult.setText( paragraphLengthResult.text );
	assessmentResult.setHasMarks( paragraphLengthResult.hasMarks );

	return assessmentResult;
};

module.exports = {
	identifier: "textParagraphTooLong",
	getResult: paragraphLengthAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	},
	getMarks: paragraphLengthMarker
};

},{"../helpers/fixFloatingPoint.js":277,"../helpers/isValueTooLong":278,"../markers/addMark.js":282,"../values/AssessmentResult.js":361,"../values/Mark.js":362,"lodash/filter":173,"lodash/map":203}],239:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var fixFloatingPoint = require( "../helpers/fixFloatingPoint.js" );
var isParagraphTooShort = require( "../helpers/isValueTooShort" );
var filter = require( "lodash/filter" );

},{"./_Reflect":144,"./_iteratorToArray":254}],189:[function(require,module,exports){
var baseEach = require('./_baseEach'),
    isArrayLike = require('./isArrayLike');

/**
 * Returns an array containing only the paragraphs shorter than the recommended length.
 * @param {array} paragraphsLength The array containing the lengths of individual paragraphs.
 * @returns {number} The number of too short paragraphs.
 */
var getTooShortParagraphs = function( paragraphsLength  ) {
	return filter( paragraphsLength, function( paragraph ) {
		return isParagraphTooShort( recommendedValue, paragraph.wordCount );
	} );
};

/**
 * Returns the scores and text for the ParagraphTooShortAssessment
 * @param {array} paragraphsLength The array containing the lengths of individual paragraphs.
 * @param {number} tooShortParagraphs The number of too short paragraphs.
 * @param {object} i18n The i18n object used for translations.
 * @returns {{score: number, text: string }} the assessmentResult.
 */
var calculateParagraphLengthResult = function( paragraphsLength, tooShortParagraphs, i18n ) {
	if ( paragraphsLength.length === 0 ) {
		return {};
	}

	// 6 is the number of scorepoints between 3, minscore and 9, maxscore. For scoring we use 40 steps, each step is 0.15
	// Up to 13 is for scoring a 3, higher numbers give higher scores.
	// FloatingPointFix because of js rounding errors.
	var score = 3 + Math.max( Math.min( ( 0.15 ) * ( paragraphsLength[ 0 ].wordCount - 13 ), 6 ), 0 );
	score = fixFloatingPoint( score );
	if ( score >= 7 ) {
		return {
			score: score,
			text: i18n.dgettext( "js-text-analysis", "None of your paragraphs are too short, which is great." )
		};
	}
	return {
		score: score,

},{"./_baseEach":170,"./isArrayLike":300}],190:[function(require,module,exports){
var baseIsMatch = require('./_baseIsMatch'),
    getMatchData = require('./_getMatchData'),
    matchesStrictComparable = require('./_matchesStrictComparable');

/**
 * Runs the getParagraphLength module, based on this returns an assessment result with score and text.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} the Assessmentresult
 */
var paragraphLengthAssessment = function( paper, researcher, i18n ) {
	var paragraphsLength = researcher.getResearch( "getParagraphLength" );
	paragraphsLength = paragraphsLength.sort(
		function( a, b ) {
			return a.wordCount - b.wordCount;
		}
	);
	var tooShortParagraphs = getTooShortParagraphs( paragraphsLength );
	var paragraphLengthResult = calculateParagraphLengthResult( paragraphsLength, tooShortParagraphs, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( paragraphLengthResult.score );
	assessmentResult.setText( paragraphLengthResult.text );

},{"./_baseIsMatch":184,"./_getMatchData":228,"./_matchesStrictComparable":266}],191:[function(require,module,exports){
var baseIsEqual = require('./_baseIsEqual'),
    get = require('./get'),
    hasIn = require('./hasIn'),
    isKey = require('./_isKey'),
    isStrictComparable = require('./_isStrictComparable'),
    matchesStrictComparable = require('./_matchesStrictComparable'),
    toKey = require('./_toKey');

module.exports = {
	identifier: "textParagraphTooShort",
	getResult: paragraphLengthAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};

},{"../helpers/fixFloatingPoint.js":277,"../helpers/isValueTooShort":279,"../values/AssessmentResult.js":361,"lodash/filter":173}],240:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var fixFloatingPoint = require( "../helpers/fixFloatingPoint.js" );

var Mark = require( "../values/Mark.js" );
var marker = require( "../markers/addMark.js" );

},{"./_baseIsEqual":182,"./_isKey":249,"./_isStrictComparable":253,"./_matchesStrictComparable":266,"./_toKey":279,"./get":293,"./hasIn":294}],192:[function(require,module,exports){
var Stack = require('./_Stack'),
    arrayEach = require('./_arrayEach'),
    assignMergeValue = require('./_assignMergeValue'),
    baseMergeDeep = require('./_baseMergeDeep'),
    isArray = require('./isArray'),
    isObject = require('./isObject'),
    isTypedArray = require('./isTypedArray'),
    keysIn = require('./keysIn');

/**
 * Calculates the result based on the number of sentences and passives.
 * @param {object} passiveVoice The object containing the number of sentences and passives
 * @param {object} i18n The object used for translations.
 * @returns {{score: number, text}} resultobject with score and text.
 */
var calculatePassiveVoiceResult = function( passiveVoice, i18n ) {
	var percentage = ( passiveVoice.passives.length / passiveVoice.total ) * 100;
	percentage = fixFloatingPoint( percentage );
	var recommendedValue = 10;

	var hasMarks = ( percentage > 0 );

	// 6 is the number of scorepoints between 3, minscore and 9, maxscore. For scoring we use 10 steps, each step is 0.6
	// Up to 6.7% passive sentences scores a 9, higher percentages give lower scores.
	// FloatingPointFix because of js rounding errors
	var score = 9 - Math.max( Math.min( ( 0.6 ) * ( percentage - 6.7 ), 6 ), 0 );
	score = fixFloatingPoint( score );
	if ( score >= 7 ) {
		return {
			score: score,
			hasMarks: hasMarks,
			text: i18n.sprintf(
					i18n.dgettext(
						"js-text-analysis",

},{"./_Stack":147,"./_arrayEach":154,"./_assignMergeValue":163,"./_baseMergeDeep":193,"./isArray":299,"./isObject":309,"./isTypedArray":314,"./keysIn":317}],193:[function(require,module,exports){
var assignMergeValue = require('./_assignMergeValue'),
    baseClone = require('./_baseClone'),
    copyArray = require('./_copyArray'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isArrayLikeObject = require('./isArrayLikeObject'),
    isFunction = require('./isFunction'),
    isObject = require('./isObject'),
    isPlainObject = require('./isPlainObject'),
    isTypedArray = require('./isTypedArray'),
    toPlainObject = require('./toPlainObject');

/**
 * Marks all sentences that have the passive voice.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @returns {object} All marked sentences.
 */
var passiveVoiceMarker = function( paper, researcher ) {
	var passiveVoice = researcher.getResearch( "passiveVoice" );
	return map( passiveVoice.passives, function( sentence ) {
		var marked = marker( sentence );
		return new Mark( {
			original: sentence,
			marked: marked
		} );
	} );
};

/**
 * Runs the getParagraphLength module, based on this returns an assessment result with score and text.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} the Assessmentresult
 */
var paragraphLengthAssessment = function( paper, researcher, i18n ) {
	var passiveVoice = researcher.getResearch( "passiveVoice" );

	var passiveVoiceResult = calculatePassiveVoiceResult( passiveVoice, i18n );

	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( passiveVoiceResult.score );
	assessmentResult.setText( passiveVoiceResult.text );
	assessmentResult.setHasMarks( passiveVoiceResult.hasMarks );

	return assessmentResult;
};

module.exports = {
	identifier: "passiveVoice",
	getResult: paragraphLengthAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	},
	getMarks: passiveVoiceMarker
};

},{"../helpers/fixFloatingPoint.js":277,"../markers/addMark.js":282,"../values/AssessmentResult.js":361,"../values/Mark.js":362,"lodash/map":203}],241:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var partition = require ( "lodash/partition" );
var sortBy = require ( "lodash/sortBy" );

},{"./_assignMergeValue":163,"./_baseClone":167,"./_copyArray":214,"./isArguments":298,"./isArray":299,"./isArrayLikeObject":301,"./isFunction":305,"./isObject":309,"./isPlainObject":311,"./isTypedArray":314,"./toPlainObject":334}],194:[function(require,module,exports){
/**
 * Counts and groups the number too often used sentence beginnings and determines the lowest count within that group.
 * @param {array} sentenceBeginnings The array containing the objects containing the beginning words and counts.
 * @returns {object} The object containing the total number of too often used beginnings and the lowest count within those.
 */
var groupSentenceBeginnings = function( sentenceBeginnings ) {
	var maximumConsecutiveDuplicates = 2;

	var tooOften = partition( sentenceBeginnings, function ( word ) {
		return word.count > maximumConsecutiveDuplicates;
	} );
	if ( tooOften[ 0 ].length === 0 ) {
		return { total: 0 };
	}
	var sortedCounts = sortBy( tooOften[ 0 ], function( word ) {
		return word.count;
	} );
	return { total: tooOften[ 0 ].length, lowestCount: sortedCounts[ 0 ].count };
};

},{}],195:[function(require,module,exports){
var baseGet = require('./_baseGet');

/**
 * Scores the repetition of sentence beginnings in consecutive sentences.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessment result
 */
var sentenceBeginningsAssessment = function( paper, researcher, i18n ) {
	var sentenceBeginnings = researcher.getResearch( "getSentenceBeginnings" );
	var groupedSentenceBeginnings = groupSentenceBeginnings( sentenceBeginnings );
	var sentenceBeginningsResult = calculateSentenceBeginningsResult ( groupedSentenceBeginnings, i18n );
	var assessmentResult = new AssessmentResult();
	assessmentResult.setScore( sentenceBeginningsResult.score );
	assessmentResult.setText( sentenceBeginningsResult.text );
	return assessmentResult;
};

module.exports = {
	getResult: sentenceBeginningsAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};


},{"../values/AssessmentResult.js":361,"lodash/partition":209,"lodash/sortBy":213}],242:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var countTooLongSentences = require( "./../assessmentHelpers/checkForTooLongSentences.js" );
var calculateTooLongSentences = require( "./../assessmentHelpers/sentenceLengthPercentageScore.js" );

},{"./_baseGet":176}],196:[function(require,module,exports){
/**
 * Calculates sentence length score
 * @param {array} sentences The array containing sentences.
 * @param {object} i18n The object used for translations.
 * @returns {object} Object containing score and text.
 */
var calculateSentenceLengthResult = function( sentences, i18n ) {
	var recommendedValue = 20;
	var tooLong = countTooLongSentences( sentences, recommendedValue ).length;
	var percentage = ( tooLong / sentences.length ) * 100;

	var score = calculateTooLongSentences( percentage );

},{}],197:[function(require,module,exports){
/**
 * Scores the percentage of sentences including more than the recommended number of words.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessmentresult
 */
var sentenceLengthInDescriptionAssessment = function( paper, researcher, i18n ) {
	var sentenceCount = researcher.getResearch( "countSentencesFromDescription" );
	var sentenceResult = calculateSentenceLengthResult( sentenceCount, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( sentenceResult.score );
	assessmentResult.setText( sentenceResult.text );

	return assessmentResult;
};

},{}],198:[function(require,module,exports){
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

},{"../values/AssessmentResult.js":361,"./../assessmentHelpers/checkForTooLongSentences.js":228,"./../assessmentHelpers/sentenceLengthPercentageScore.js":229}],243:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var countTooLongSentences = require( "./../assessmentHelpers/checkForTooLongSentences.js" );
var calculateTooLongSentences = require( "./../assessmentHelpers/sentenceLengthPercentageScore.js" );
var fixFloatingPoint = require( "../helpers/fixFloatingPoint.js" );

var Mark = require( "../values/Mark.js" );
var addMark = require( "../markers/addMark.js" );

},{}],199:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    isSymbol = require('./isSymbol');

var map = require( "lodash/map" );

var recommendedValue = 20;
var maximumPercentage = 25;

/**
 * Gets the sentences that are qualified as being too long.
 *
 * @param {Object} sentences The sentences to filter through.
 * @param {Number} recommendedValue The recommended number of words.
 * @returns {Array} Array with all the sentences considered to be too long.
 */
var tooLongSentences = function( sentences, recommendedValue ) {
	return countTooLongSentences( sentences, recommendedValue );
};

},{"./_Symbol":148,"./isSymbol":313}],200:[function(require,module,exports){
/**
 * Get the total amount of sentences that are qualified as being too long.
 *
 * @param {Object} sentences The sentences to filter through.
 * @param {Number} recommendedValue The recommended number of words.
 * @returns {Number} The amount of sentences that are considered too long.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;

},{}],201:[function(require,module,exports){
var SetCache = require('./_SetCache'),
    arrayIncludes = require('./_arrayIncludes'),
    arrayIncludesWith = require('./_arrayIncludesWith'),
    cacheHas = require('./_cacheHas'),
    createSet = require('./_createSet'),
    setToArray = require('./_setToArray');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Calculates sentence length score.
 *
 * @param {Object} sentences The object containing sentences and its length.
 * @param {Object} i18n The object used for translations.
 * @returns {Object} Object containing score and text.
 */
var calculateSentenceLengthResult = function( sentences, i18n ) {
	var tooLongTotal = tooLongSentencesTotal( sentences, recommendedValue );
	var percentage = fixFloatingPoint( ( tooLongTotal / sentences.length ) * 100 );
	var score = calculateTooLongSentences( percentage );
	var hasMarks = ( percentage > 0 );

	if ( score >= 7 ) {
		return {
			score: score,
			hasMarks: hasMarks,

			// translators: %1$s expands to the percentage of sentences, %2$d expands to the maximum percentage of sentences.
			// %3$s expands to the recommended amount of words.
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "%1$s of the sentences contain more than %3$d words, " +
				"which is less than or equal to the recommended maximum of %2$s." ), percentage + "%", maximumPercentage + "%", recommendedValue )
		};
	}

	return {
		score: score,
		hasMarks: hasMarks,

},{"./_SetCache":146,"./_arrayIncludes":156,"./_arrayIncludesWith":157,"./_cacheHas":203,"./_createSet":221,"./_setToArray":272}],202:[function(require,module,exports){
var arrayMap = require('./_arrayMap');

/**
 * Scores the percentage of sentences including more than the recommended number of words.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessmentresult
 */
var sentenceLengthInTextAssessment = function( paper, researcher, i18n ) {
	var sentenceCount = researcher.getResearch( "countSentencesFromText" );
	var sentenceResult = calculateSentenceLengthResult( sentenceCount, i18n );

	var assessmentResult = new AssessmentResult();
	assessmentResult.setScore( sentenceResult.score );
	assessmentResult.setText( sentenceResult.text );
	assessmentResult.setHasMarks( sentenceResult.hasMarks );

	return assessmentResult;
};

},{"./_arrayMap":158}],203:[function(require,module,exports){
/**
 * Mark the sentences.
 *
 * @param {Paper} paper The paper to use for the marking.
 * @param {Researcher} researcher The researcher to use.
 * @returns {Array} Array with all the marked sentences.
 */
var sentenceLengthMarker = function( paper, researcher ) {
	var sentenceCount = researcher.getResearch( "countSentencesFromText" );
	var sentenceObjects = tooLongSentences( sentenceCount, recommendedValue );

	return map( sentenceObjects, function( sentenceObject ) {
		return new Mark( {
			original: sentenceObject.sentence,
			marked: addMark( sentenceObject.sentence )
		} );
	} );
};

},{}],204:[function(require,module,exports){
var isArray = require('./isArray'),
    stringToPath = require('./_stringToPath');

/**
 * Calculates the score based on the given deviation.
 *
 * @param {number} standardDeviation The deviation to calculate the score for.
 * @returns {number} The calculated score.
 */
var calculateScore = function( standardDeviation ) {
	return 3 + Math.max( Math.min( ( 6 ) * ( standardDeviation - 2.33 ), 6 ), 0 );
};

/**
 * Get the result based on the score. When score is 7 or more, the result is good. Below 7 should be improved.
 *
 * @param {number} standardDeviation The deviation to calculate the score for.
 * @param {object} i18n The object used for translations.
 * @returns {{score: number, text: *}} The calculated result.
 */
var getStandardDeviationResult = function( standardDeviation, i18n ) {
	var score = calculateScore( standardDeviation );
	var recommendedMinimumDeviation = 3;
	if ( score >= 7 ) {
		return {
			score: score,
			text: i18n.sprintf(
				i18n.dgettext(
					"js-text-analysis",
					// translators: %1$s expands to the calculated score. %2$d expands to the recommended minimum score
					"The sentence length variation score is %1$s, which is more than or equal to the recommended minimum of %2$d. The text " +
					"contains a nice combination of long and short sentences."
				), standardDeviation, recommendedMinimumDeviation
			)
		};
	}

	return {
		score: score,
		text: i18n.sprintf(
			i18n.dgettext(
				"js-text-analysis",
				// translators: %1$s expands to the calculated score. %2$d expands to the recommended minimum score
				"The sentence length variation score is %1$s, which is less than the recommended minimum of %2$d. Try to " +
				"alternate more between long and short sentences."
			), standardDeviation, recommendedMinimumDeviation
		)
	};
};

},{"./_stringToPath":278,"./isArray":299}],205:[function(require,module,exports){
/**
 * Runs the sentenceVariation research and checks scores based on calculated deviation.
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessmentresult
 */
var getSentenceVariation = function( paper, researcher, i18n ) {
	var standardDeviation = researcher.getResearch( "sentenceVariation" );
	var sentenceDeviationResult =  getStandardDeviationResult( standardDeviation, i18n );

	var assessmentResult = new AssessmentResult();

},{}],206:[function(require,module,exports){
var Uint8Array = require('./_Uint8Array');

/**
 * Counts the number of subheading texts that are too long.
 * @param {Array} subheadingTextsLength Array with subheading text lengths.
 * @param {number} recommendedValue The recommended maximum value of the subheading text length
 * @returns {number} The number of subheading texts that are too long.
 */
var getTooLongSubheadingTexts = function( subheadingTextsLength, recommendedValue ) {
	var tooLongTexts = filter( subheadingTextsLength, isTextTooLong.bind( null, recommendedValue ) );
	return tooLongTexts.length;
};

},{"./_Uint8Array":149}],207:[function(require,module,exports){
/**
 * Calculates the score based on the subheading texts length.
 * @param {Array} subheadingTextsLength Array with subheading text lengths.
 * @param {number} tooLongTexts The number of subheading texts that are too long.
 * @param {number} recommendedValue The recommended maximum value of the subheading text length
 * @param {object} i18n The object used for translations.
 * @returns {object} the resultobject containing a score and text if subheadings are present
 */
var subheadingsTextLength = function( subheadingTextsLength, tooLongTexts, recommendedValue, i18n ) {

	// Return empty result if there are no subheadings
	if ( subheadingTextsLength.length === 0 ) {
		return {};
	}

},{}],208:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer');

/**
 * Runs the getSubheadingLength research and checks scores based on length.
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessmentresult
 */
var getSubheadingsTextLength = function( paper, researcher, i18n ) {
	var subheadingTextsLength = researcher.getResearch( "getSubheadingTextLengths" );
	subheadingTextsLength = subheadingTextsLength.sort(
		function( a, b ) {
			return b - a;
		}
	);
	var recommendedValue = 300;
	var tooLongTexts = getTooLongSubheadingTexts( subheadingTextsLength, recommendedValue );
	var subheadingsTextLengthresult = subheadingsTextLength( subheadingTextsLength, tooLongTexts, recommendedValue, i18n );

	var assessmentResult = new AssessmentResult();

},{"./_cloneArrayBuffer":206}],209:[function(require,module,exports){
var addMapEntry = require('./_addMapEntry'),
    arrayReduce = require('./_arrayReduce'),
    mapToArray = require('./_mapToArray');

	return assessmentResult;
};

module.exports = {
	identifier: "subheadingsTooLong",
	getResult: getSubheadingsTextLength,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};

},{"./_addMapEntry":151,"./_arrayReduce":160,"./_mapToArray":265}],210:[function(require,module,exports){
/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Counts the number of subheading texts that are too short.
 * @param {Array} subheadingTextsLength Array with subheading text lengths.
 * @param {number} recommendedValue The recommended minimum value of the subheading text length
 * @returns {number} The number of subheading texts that are too short.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;

},{}],211:[function(require,module,exports){
var addSetEntry = require('./_addSetEntry'),
    arrayReduce = require('./_arrayReduce'),
    setToArray = require('./_setToArray');

/**
 * Calculates the score based on the subheading texts length.
 * @param {Array} subheadingTextsLength Array with subheading text lengths.
 * @param {number} tooShortTexts The number of subheading texts that are too long.
 * @param {number} recommendedValue The recommended minimum value of the subheading text length
 * @param {object} i18n The object used for translations.
 * @returns {object} the resultobject containing a score and text if subheadings are present
 */
var subheadingsTextLength = function( subheadingTextsLength, tooShortTexts, recommendedValue, i18n ) {

	// Return empty result if there are no subheadings
	if ( subheadingTextsLength.length === 0 ) {
		return {};
	}

},{"./_addSetEntry":152,"./_arrayReduce":160,"./_setToArray":272}],212:[function(require,module,exports){
var Symbol = require('./_Symbol');

	if ( score >= 7 ) {
		return {
			score: score,
			text: i18n.sprintf(
				i18n.dgettext(
						"js-text-analysis",
						"The number of words following each of your subheadings exceeds the recommended minimum of %1$d words, which is great."
				), recommendedValue
			)
		};
	}
	return {
		score: score,

		// translators: %1$d expands to the number of subheadings, %2$d expands to the recommended value
		text: i18n.sprintf(
			i18n.dngettext(
					"js-text-analysis",
					"The number of words following %1$d of your subheadings is less than or equal to the recommended minimum of %2$d words. " +
					"Consider deleting that particular subheading, or the following subheading.",
					"The number of words following %1$d of your subheadings is less than or equal to the recommended minimum of %2$d words. " +
					"Consider deleting those particular subheadings, or the subheading following each of them.",
					tooShortTexts ),
				tooShortTexts, recommendedValue
		)
	};
};

/**
 * Runs the getSubheadingLength research and checks scores based on length.
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessmentresult
 */
var getSubheadingsTextLength = function( paper, researcher, i18n ) {
	var subheadingTextsLength = researcher.getResearch( "getSubheadingTextLengths" );
	subheadingTextsLength = subheadingTextsLength.sort(
		function( a, b ) {
			return a - b;
		}
	);
	var recommendedValue = 40;
	var tooShortTexts = getTooShortSubheadingTexts( subheadingTextsLength, recommendedValue );
	var subheadingsTextLengthresult = subheadingsTextLength( subheadingTextsLength, tooShortTexts, recommendedValue, i18n );

},{"./_Symbol":148}],213:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer');

module.exports = {
	identifier: "subheadingTooShort",
	getResult: getSubheadingsTextLength,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};

},{"../helpers/isValueTooShort":279,"../values/AssessmentResult.js":361,"lodash/filter":173}],247:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

},{"./_cloneArrayBuffer":206}],214:[function(require,module,exports){
/**
 * Returns the score based on the number of subheadings found.
 * @param {number} subheadingPresence The number of subheadings found.
 * @param {object} i18n The object used for translations.
 * @returns {Object} An object with values for the assessment result.
 */
var calculateSubheadingPresenceResult = function( subheadingPresence, i18n ) {
	if( subheadingPresence > 0 ) {
		return {
			score: 9,

			// translators: %1$d expands to the number of subheadings
			text: i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",
					"The text contains %1$d subheading, which is great.",
					"The text contains %1$d subheadings, which is great.",
					subheadingPresence
				), subheadingPresence
			)
		};
	}

},{}],215:[function(require,module,exports){
var assignValue = require('./_assignValue');

/**
 * Runs the getSubheadingLength research and checks scores based on length.
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessmentresult
 */
var getSubheadingPresence = function( paper, researcher, i18n ) {
	var subheadingPresence = researcher.getResearch( "getSubheadingPresence" );
	var result = calculateSubheadingPresenceResult( subheadingPresence, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( result.score );
	assessmentResult.setText( result.text );

	return assessmentResult;
};

module.exports = {
	identifier: "subheadingPresence",
	getResult: getSubheadingPresence,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};

},{"../values/AssessmentResult.js":361}],248:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

},{"./_assignValue":164}],216:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    getSymbols = require('./_getSymbols');

/**
 * Runs the match keyword in subheadings module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} the Assessmentresult
 */
var subheadingsHaveKeywordAssessment = function( paper, researcher, i18n ) {
	var subHeadings = researcher.getResearch( "matchKeywordInSubheadings" );
	var subHeadingsResult = calculateKeywordMatchesResult( subHeadings, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( subHeadingsResult.score );
	assessmentResult.setText( subHeadingsResult.text );

},{"./_copyObject":215,"./_getSymbols":231}],217:[function(require,module,exports){
var root = require('./_root');

module.exports = {
	identifier: "subheadingsKeyword",
	getResult: subheadingsHaveKeywordAssessment,
	isApplicable: function( paper ) {
		return paper.hasText() && paper.hasKeyword();
	}
};

},{"../values/AssessmentResult.js":361}],249:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

},{"./_root":269}],218:[function(require,module,exports){
var isIterateeCall = require('./_isIterateeCall'),
    rest = require('./rest');

/**
 * Returns a score and text based on the number of links.
 *
 * @param {object} linkStatistics The object with all linkstatistics.
 * @param {object} i18n The object used for translations
 * @returns {object} resultObject with score and text
 */
function createAssigner(assigner) {
  return rest(function(object, sources) {
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

},{"./_isIterateeCall":248,"./rest":327}],219:[function(require,module,exports){
var isArrayLike = require('./isArrayLike');

/**
 * Runs the linkCount module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var textHasCompetingLinksAssessment = function( paper, researcher, i18n ) {
	var linkCount = researcher.getResearch( "getLinkStatistics" );

	var linkCountResult = calculateLinkCountResult( linkCount, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( linkCountResult.score );
	assessmentResult.setText( linkCountResult.text );
	assessmentResult.setHasMarks( linkCountResult.hasMarks );

	return assessmentResult;
};

},{"./isArrayLike":300}],220:[function(require,module,exports){
/**
 * Mark the anchors.
 *
 * @param {Paper} paper The paper to use for the marking.
 * @param {Researcher} researcher The researcher to use.
 * @returns {Array} Array with all the marked anchors.
 */
var competingLinkMarker = function( paper, researcher ) {
	var competingLinks = researcher.getResearch( "getLinkStatistics" );

	return map( competingLinks.keyword.matchedAnchors, function( matchedAnchor ) {
		return new Mark( {
			original: matchedAnchor,
			marked: addMark( matchedAnchor )
		} );
	} );
};

module.exports = {
	identifier: "textCompetingLinks",
	getResult: textHasCompetingLinksAssessment,
	isApplicable: function ( paper ) {
		return paper.hasText() && paper.hasKeyword();
	},
	getMarks: competingLinkMarker
};

},{"../markers/addMark.js":282,"../values/AssessmentResult.js":361,"../values/Mark.js":362,"lodash/map":203}],250:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var isEmpty = require( "lodash/isEmpty" );

},{}],221:[function(require,module,exports){
var Set = require('./_Set'),
    noop = require('./noop'),
    setToArray = require('./_setToArray');

	return {};
};

/**
 * Calculate the score based on the current image alt-tag count.
 * @param {object} altProperties An object containing the various alt-tags.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var assessImages = function( altProperties, i18n ) {
	// Has alt-tag and keywords
	if ( altProperties.withAltKeyword > 0 ) {
		return {
			score: 9,
			text: i18n.dgettext( "js-text-analysis", "The images on this page contain alt attributes with the focus keyword." )
		};
	}

	// Has alt-tag, but no keywords and it's not okay
	if ( altProperties.withAltNonKeyword > 0 ) {
		return {
			score: 5,
			text: i18n.dgettext( "js-text-analysis", "The images on this page do not have alt attributes containing your focus keyword." )
		};
	}

},{"./_Set":145,"./_setToArray":272,"./noop":323}],222:[function(require,module,exports){
var SetCache = require('./_SetCache'),
    arraySome = require('./_arraySome');

	// Has no alt-tag
	if ( altProperties.noAlt > 0 ) {
		return {
			score: 5,
			text: i18n.dgettext( "js-text-analysis", "The images on this page are missing alt attributes." )
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
var textHasImagesAssessment = function( paper, researcher, i18n ) {
	var assessmentResult = new AssessmentResult();

	var imageCount = researcher.getResearch( "imageCount" );
	var imageCountResult = calculateImageCountResult( imageCount, i18n );

	if ( isEmpty( imageCountResult ) ) {
		var altTagCount = researcher.getResearch( "altTagCount" );
		var altTagCountResult = assessImages( altTagCount, i18n );

		assessmentResult.setScore( altTagCountResult.score );
		assessmentResult.setText( altTagCountResult.text );

},{"./_SetCache":146,"./_arraySome":161}],223:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    Uint8Array = require('./_Uint8Array'),
    equalArrays = require('./_equalArrays'),
    mapToArray = require('./_mapToArray'),
    setToArray = require('./_setToArray');

	assessmentResult.setScore( imageCountResult.score );
	assessmentResult.setText( imageCountResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "textImages",
	getResult: textHasImagesAssessment,
	isApplicable: function ( paper ) {
		return paper.hasText();
	}
};

},{"../values/AssessmentResult.js":361,"lodash/isEmpty":189}],251:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var inRange = require( "lodash/inRange" );

/**
 * Calculate the score based on the current word count.
 * @param {number} wordCount The amount of words to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var calculateWordCountResult = function( wordCount, i18n ) {
	if ( wordCount > 300 ) {
		return {
			score: 9,
			text: i18n.dngettext(
				"js-text-analysis",
				/* translators: %1$d expands to the number of words in the text, %2$s to the recommended minimum of words */
				"The text contains %1$d word, which is more than the recommended minimum of %2$d word.",
				"The text contains %1$d words, which is more than the recommended minimum of %2$d words.",
				wordCount
			)
		};
	}

	if ( inRange( wordCount, 250, 300 ) ) {
		return {
			score: 7,
			text: i18n.dngettext(
				"js-text-analysis",
				/* translators: %1$d expands to the number of words in the text, %2$s to the recommended minimum of words */
				"The text contains %1$d word, which is slightly below the recommended minimum of %2$d word. Add a bit more copy.",
				"The text contains %1$d words, which is slightly below the recommended minimum of %2$d words. Add a bit more copy.",
				wordCount
			)
		};
	}

	if ( inRange( wordCount, 200, 250 ) ) {
		return {
			score: 5,
			text: i18n.dngettext(
				"js-text-analysis",
				/* translators: %1$d expands to the number of words in the text, %2$d to the recommended minimum of words */
				"The text contains %1$d word, which is below the recommended minimum of %2$d word. " +
				"Add more useful content on this topic for readers.",
				"The text contains %1$d words, which is below the recommended minimum of %2$d words. " +
				"Add more useful content on this topic for readers.",
				wordCount
			)
		};
	}

	if ( inRange( wordCount, 100, 200 ) ) {
		return {
			score: -10,
			text: i18n.dngettext(
				"js-text-analysis",
				/* translators: %1$d expands to the number of words in the text, %2$d to the recommended minimum of words */
				"The text contains %1$d word, which is below the recommended minimum of %2$d word. " +
				"Add more useful content on this topic for readers.",
				"The text contains %1$d words, which is below the recommended minimum of %2$d words. " +
				"Add more useful content on this topic for readers.",
				wordCount
			)
		};
	}

	if ( inRange( wordCount, 0, 100 ) ) {
		return {
			score: -20,
			text: i18n.dngettext(
				"js-text-analysis",
				/* translators: %1$d expands to the number of words in the text */
				"The text contains %1$d word, which is far too low. Increase the word count.",
				"The text contains %1$d words, which is far too low. Increase the word count.",
				wordCount
			)
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
var textLengthAssessment = function( paper, researcher, i18n ) {
	var wordCount = researcher.getResearch( "wordCountInText" );
	var wordCountResult = calculateWordCountResult( wordCount, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( wordCountResult.score );
	assessmentResult.setText( i18n.sprintf( wordCountResult.text, wordCount, 300 ) );

	return assessmentResult;
};

},{"./_Symbol":148,"./_Uint8Array":149,"./_equalArrays":222,"./_mapToArray":265,"./_setToArray":272}],224:[function(require,module,exports){
var baseHas = require('./_baseHas'),
    keys = require('./keys');

},{"../values/AssessmentResult.js":361,"lodash/inRange":182}],252:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var isEmpty = require( "lodash/isEmpty" );

/**
 * Returns a score and text based on the linkStatistics object.
 *
 * @param {object} linkStatistics The object with all linkstatistics.
 * @param {object} i18n The object used for translations
 * @returns {object} resultObject with score and text
 */
var calculateLinkStatisticsResult = function( linkStatistics, i18n ) {
	if ( linkStatistics.total === 0 ) {
		return {
			score: 6,
			text: i18n.dgettext( "js-text-analysis", "No links appear in this page, consider adding some as appropriate." )
		};
	}

	if ( linkStatistics.externalNofollow === linkStatistics.total ) {
		return {
			score: 7,
			/* translators: %1$s expands the number of outbound links */
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "This page has %1$s outbound link(s), all nofollowed." ),
				linkStatistics.externalNofollow )
		};
	}

	if ( linkStatistics.externalNofollow < linkStatistics.total ) {
		return {
			score: 8,
			/* translators: %1$s expands to the number of nofollow links, %2$s to the number of outbound links */
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "This page has %1$s nofollowed link(s) and %2$s normal outbound link(s)." ),
				linkStatistics.externalNofollow, linkStatistics.externalDofollow )
		};
	}

	if ( linkStatistics.externalDofollow === linkStatistics.total ) {
		return {
			score: 9,
			/* translators: %1$s expands to the number of outbound links */
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "This page has %1$s outbound link(s)." ), linkStatistics.externalTotal )
		};
	}
};

/**
 * Runs the getLinkStatistics module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var textHasLinksAssessment = function( paper, researcher, i18n ) {
	var linkStatistics = researcher.getResearch( "getLinkStatistics" );
	var assessmentResult = new AssessmentResult();
	if ( !isEmpty( linkStatistics ) ) {
		var linkStatisticsResult = calculateLinkStatisticsResult( linkStatistics, i18n );
		assessmentResult.setScore( linkStatisticsResult.score );
		assessmentResult.setText( linkStatisticsResult.text );
	}
	return assessmentResult;
};

module.exports = {
	identifier: "textLinks",
	getResult: textHasLinksAssessment,
	isApplicable: function ( paper ) {
		return paper.hasText();
	}
};

},{"./_baseHas":178,"./keys":316}],225:[function(require,module,exports){
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbols = require('./_getSymbols'),
    keys = require('./keys');

/**
 * Runs the match subheadings module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} the Assessmentresult
 */
var textHasSubheadingsAssessment = function( paper, researcher, i18n ) {
	var subHeadings = researcher.getResearch( "matchKeywordInSubheadings" );
	var subHeadingsResult = calculateSubheadingMatchesResult( subHeadings, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( subHeadingsResult.score );
	assessmentResult.setText( subHeadingsResult.text );

},{"./_baseGetAllKeys":177,"./_getSymbols":231,"./keys":316}],226:[function(require,module,exports){
var baseProperty = require('./_baseProperty');

/**
 * Executes the pagetitle keyword assessment and returns an assessment result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment with text and score
 */
var titleHasKeywordAssessment = function( paper, researcher, i18n ) {
	var keywordMatches = researcher.getResearch( "findKeywordInPageTitle" );
	var score, text;

	if ( keywordMatches.matches === 0 ) {
		score = 2;
		text = i18n.sprintf( i18n.dgettext( "js-text-analysis", "The focus keyword '%1$s' does not appear in the SEO title." ), paper.getKeyword() );
	}

},{"./_baseProperty":194}],227:[function(require,module,exports){
var isKeyable = require('./_isKeyable');

/**
 * Returns the score and text for the pageTitleLength
 * @param {number} pageTitleLength The length of the pageTitle.
 * @param {object} i18n The i18n object used for translations.
 * @returns {object} The result object.
 */
var calculatePageTitleLengthResult = function( pageTitleLength, i18n ) {
	var minLength = 35;
	var maxLength = 65;

	if ( inRange( pageTitleLength, 1, 35 ) ) {
		return {
			score: 6,
			text: i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",
					/* translators: %1$d expands to the number of characters in the page title,
					%2$d to the minimum number of characters for the title */
					"The page title contains %1$d character, which is less than the recommended minimum of %2$d characters. " +
					"Use the space to add keyword variations or create compelling call-to-action copy.",
					"The page title contains %1$d characters, which is less than the recommended minimum of %2$d characters. " +
					"Use the space to add keyword variations or create compelling call-to-action copy.",
				pageTitleLength ),
				pageTitleLength, minLength )
		};
	}

},{"./_isKeyable":250}],228:[function(require,module,exports){
var isStrictComparable = require('./_isStrictComparable'),
    keys = require('./keys');

/**
 * Runs the pageTitleLength module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var titleLengthAssessment = function( paper, researcher, i18n ) {
	var pageTitleLength = researcher.getResearch( "pageTitleLength" );
	var pageTitleLengthResult = calculatePageTitleLengthResult( pageTitleLength, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( pageTitleLengthResult.score );
	assessmentResult.setText( pageTitleLengthResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "titleLength",
	getResult: titleLengthAssessment
};

},{"./_isStrictComparable":253,"./keys":316}],229:[function(require,module,exports){
var baseIsNative = require('./_baseIsNative'),
    getValue = require('./_getValue');

/**
 * Calculates transition word result
 * @param {object} transitionWordSentences The object containing the total number of sentences and the number of sentences containing
 * a transition word.
 * @param {object} i18n The object used for translations.
 * @returns {object} Object containing score and text.
 */
var calculateTransitionWordResult = function( transitionWordSentences, i18n ) {
	var score, unboundedScore;
	var percentage = ( transitionWordSentences.transitionWordSentences / transitionWordSentences.totalSentences ) * 100;
	var hasMarks   = ( percentage > 0 );

	if ( percentage <= 23.3 ) {
		// The 10 percentage points from 13.3 to 23.3 are scaled to a range of 6 score points: 6/10 = 0.6.
		// 23.3 scores 9, 13.3 scores 3.
		unboundedScore = 3 + ( 0.6  * ( percentage - 13.3 ) );

		// Scores exceeding 9 are 9, scores below 3 are 3.
		score = Math.max( Math.min( unboundedScore, 9 ), 3 );
		if ( score < 7 ) {
			var recommendedMinimum = 20;
			return {
				score: score,
				hasMarks: hasMarks,
				text: i18n.sprintf(
					i18n.dgettext( "js-text-analysis", "%1$s of the sentences contain a transition word or phrase, " +
						"which is less than the recommended minimum of %2$s." ),
					percentage.toFixed( 1 ) + "%", recommendedMinimum + "%" )
			};
		}
	}

},{"./_baseIsNative":185,"./_getValue":233}],230:[function(require,module,exports){
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetPrototype = Object.getPrototypeOf;

/**
 * Scores the percentage of sentences including one or more transition words.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessment result.
 */
var transitionWordsAssessment = function( paper, researcher, i18n ) {
	var transitionWordSentences = researcher.getResearch( "findTransitionWords" );
	var transitionWordResult = calculateTransitionWordResult( transitionWordSentences, i18n );
	var assessmentResult = new AssessmentResult();

},{}],231:[function(require,module,exports){
var stubArray = require('./stubArray');

	return assessmentResult;
};

/**
 * Marks text for the transition words assessment.
 * @param {Paper} paper The paper to use for the marking.
 * @param {Researcher} researcher The researcher containing the necessary research.
 * @returns {Array<Mark>} A list of marks that should be applied.
 */
var transitionWordsMarker = function( paper, researcher ) {
	var transitionWordSentences = researcher.getResearch( "findTransitionWords" );

	return map( transitionWordSentences.sentenceResults, function( sentenceResult ) {
		var sentence = sentenceResult.sentence;

		return new Mark( {
			original: sentence,
			marked: marker( sentence )
		} );
	} );
};

},{"./stubArray":328}],232:[function(require,module,exports){
var DataView = require('./_DataView'),
    Map = require('./_Map'),
    Promise = require('./_Promise'),
    Set = require('./_Set'),
    WeakMap = require('./_WeakMap'),
    toSource = require('./_toSource');

},{"../markers/addMark.js":282,"../values/AssessmentResult.js":361,"../values/Mark.js":362,"lodash/isUndefined":200,"lodash/map":203}],257:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Calculate the score based on whether or not there's a keyword in the url.
 * @param {number} keywordsResult The amount of keywords to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var calculateUrlKeywordCountResult = function( keywordsResult, i18n ) {

	if ( keywordsResult > 0 ) {
		return {
			score: 9,
			text: i18n.dgettext( "js-text-analysis", "The focus keyword appears in the URL for this page." )
		};
	}

	return {
		score: 6,
		text: i18n.dgettext( "js-text-analysis", "The focus keyword does not appear in the URL for this page. " +
		                                         "If you decide to rename the URL be sure to check the old URL 301 redirects to the new one!" )
	};
};

/**
 * Execute the Assessment and return a result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var urlHasKeywordAssessment = function( paper, researcher, i18n ) {
	var keywords = researcher.getResearch( "keywordCountInUrl" );
	var keywordsResult = calculateUrlKeywordCountResult( keywords, i18n );

	var assessmentResult = new AssessmentResult();
	assessmentResult.setScore( keywordsResult.score );
	assessmentResult.setText( keywordsResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "urlKeyword",
	getResult: urlHasKeywordAssessment,
	isApplicable: function( paper ) {
		return paper.hasKeyword() && paper.hasUrl();
	}
};

},{"../values/AssessmentResult.js":361}],258:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * The assessment that checks the url length
 *
 * @param {Paper} paper The paper to run this assessment on.
 * @param {object} researcher The researcher used for the assessment.
 * @param {object} i18n The i18n-object used for parsing translations.
 * @returns {object} an AssessmentResult with the score and the formatted text.
 */
var urlLengthAssessment = function( paper, researcher, i18n ) {
	var urlIsTooLong = researcher.getResearch( "urlLength" );
	var assessmentResult = new AssessmentResult();
	if ( urlIsTooLong ) {
		var score = 5;
		var text = i18n.dgettext( "js-text-analysis", "The slug for this page is a bit long, consider shortening it." );
		assessmentResult.setScore( score );
		assessmentResult.setText( text );
	}
	return assessmentResult;
};

module.exports = {
	identifier: "urlLength",
	getResult: urlLengthAssessment,
	isApplicable: function ( paper ) {
		return paper.hasUrl();
	}
};

},{"../values/AssessmentResult.js":361}],259:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

},{"./_DataView":138,"./_Map":141,"./_Promise":143,"./_Set":145,"./_WeakMap":150,"./_toSource":280}],233:[function(require,module,exports){
/**
 * Calculate the score based on the amount of stop words in the url.
 * @param {number} stopWordCount The amount of stop words to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var calculateUrlStopWordsCountResult = function( stopWordCount, i18n ) {

	if ( stopWordCount > 0 ) {
		return {
			score: 5,
			text: i18n.dngettext(
				"js-text-analysis",
				/* translators: %1$s opens a link to a wikipedia article about stop words, %2$s closes the link */
				"The slug for this page contains a %1$sstop word%2$s, consider removing it.",
				"The slug for this page contains %1$sstop words%2$s, consider removing them.",
				stopWordCount
			)
		};
	}

},{}],234:[function(require,module,exports){
var castPath = require('./_castPath'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isIndex = require('./_isIndex'),
    isKey = require('./_isKey'),
    isLength = require('./isLength'),
    isString = require('./isString'),
    toKey = require('./_toKey');

/**
 * Execute the Assessment and return a result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var urlHasStopWordsAssessment = function( paper, researcher, i18n ) {
	var stopWords = researcher.getResearch( "stopWordsInUrl" );
	var stopWordsResult = calculateUrlStopWordsCountResult( stopWords.length, i18n );

	var assessmentResult = new AssessmentResult();
	assessmentResult.setScore( stopWordsResult.score );
	assessmentResult.setText( i18n.sprintf(
		stopWordsResult.text,
		/* translators: this link is referred to in the content analysis when a slug contains one or more stop words */
		"<a href='" + i18n.dgettext( "js-text-analysis", "http://en.wikipedia.org/wiki/Stop_words" ) + "' target='new'>",
		"</a>"
	) );

	return assessmentResult;
};

module.exports = {
	identifier: "urlStopWords",
	getResult: urlHasStopWordsAssessment
};

},{"../values/AssessmentResult.js":361}],260:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var fixFloatingPoint = require( "../helpers/fixFloatingPoint.js" );
var filter = require( "lodash/filter" );
var map = require( "lodash/map" );

var Mark = require( "../values/Mark.js" );
var addMark = require( "../markers/addMark.js" );

},{"./_castPath":204,"./_isIndex":247,"./_isKey":249,"./_toKey":279,"./isArguments":298,"./isArray":299,"./isLength":306,"./isString":312}],235:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/**
 * Filters the words that aren't too long.
 *
 * @param {Array} words The array with words to filter on complexity.
 * @returns {Array} The filtered list with complex words.
 */
var filterComplexity = function( words ) {
	return filter( words, function( word ) {
		return( word.complexity > recommendedValue );
	} );
};

},{"./_nativeCreate":268}],236:[function(require,module,exports){
/**
 * Calculates the complexity of the text based on the syllables in words.
 * @param {number} wordCount The number of words used.
 * @param {Array} wordComplexity The list of words with their syllable count.
 * @param {Object} i18n The object used for translations.
 * @returns {{score: number, text}} resultobject with score and text.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

module.exports = hashDelete;

},{}],237:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

	if ( score >= 7 ) {
		return {
			score: score,
			hasMarks: hasMarks,
			text: i18n.sprintf(
				i18n.dgettext(
					"js-text-analysis",
					// Translators: %1$s expands to the percentage of complex words, %2$d expands to the recommended number of syllables,
					// %3$s expands to the recommend maximum
					"%1$s of the words contain over %2$d syllables, which is less than or equal to the recommended maximum of %3$s." ),
				percentage + "%", recommendedValue, recommendedMaximum + "%"  )
		};
	}

	return {
		score: score,
		hasMarks: hasMarks,
		text: i18n.sprintf(
			i18n.dgettext(
				"js-text-analysis",
				// Translators: %1$s expands to the percentage of too complex words, %2$d expands to the recommended number of syllables
				// %3$s expands to the recommend maximum
				"%1$s of the words contain over %2$d syllables, which is more than the recommended maximum of %3$s." ),
			percentage + "%", recommendedValue, recommendedMaximum + "%" )
	};
};

/**
 * Creates markers of words that are complex.
 *
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @returns {Array} A list with markers
 */
var wordComplexityMarker = function( paper, researcher ) {
	var wordComplexity = researcher.getResearch( "wordComplexity" );
	var complexWords = filterComplexity( wordComplexity );
	return map( complexWords, function( complexWord ) {
		return new Mark( {
			original: complexWord.word,
			marked:  addMark( complexWord.word )
		} );
	} );
};

/**
 * Execute the word complexity assessment and return a result based on the syllables in words
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The object used for translations
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var wordComplexityAssessment = function( paper, researcher, i18n ) {
	var wordComplexity = researcher.getResearch( "wordComplexity" );
	var wordCount = wordComplexity.length;

},{"./_nativeCreate":268}],238:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

module.exports = {
	identifier: "wordComplexity",
	getResult: wordComplexityAssessment,
	isApplicable: function ( paper ) {
		return paper.hasText();
	},
	getMarks: wordComplexityMarker
};

},{"../helpers/fixFloatingPoint.js":277,"../markers/addMark.js":282,"../values/AssessmentResult.js":361,"../values/Mark.js":362,"lodash/filter":173,"lodash/map":203}],261:[function(require,module,exports){
var Researcher = require( "./researcher.js" );
var MissingArgument = require( "./errors/missingArgument" );
var removeDuplicateMarks = require( "./markers/removeDuplicateMarks" );
var AssessmentResult = require( "./values/AssessmentResult.js" );
var showTrace = require( "./helpers/errors.js" ).showTrace;

var isUndefined = require( "lodash/isUndefined" );
var isFunction = require( "lodash/isFunction" );
var forEach = require( "lodash/forEach" );
var filter = require( "lodash/filter" );
var map = require( "lodash/map" );
var findIndex = require( "lodash/findIndex" );
var find = require( "lodash/find" );

var ScoreRating = 9;

/**
 * Creates the Assessor
 *
 * @param {Object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
var Assessor = function( i18n, options ) {
	this.setI18n( i18n );
	this._assessments = [];

},{"./_nativeCreate":268}],239:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/**
 * Checks if the i18n object is defined and sets it.
 * @param {Object} i18n The i18n object used for translations.
 * @throws {MissingArgument} Parameter needs to be a valid i18n object.
 */
Assessor.prototype.setI18n = function( i18n ) {
	if ( isUndefined( i18n ) ) {
		throw new MissingArgument( "The assessor requires an i18n object." );
	}
	this.i18n = i18n;
};

/**
 * Gets all available assessments.
 * @returns {object} assessment
 */
Assessor.prototype.getAvailableAssessments = function() {
	return this._assessments;
};

/**
 * Checks whether or not the Assessment is applicable.
 * @param {Object} assessment The Assessment object that needs to be checked.
 * @param {Paper} paper The Paper object to check against.
 * @param {Researcher} [researcher] The Researcher object containing additional information.
 * @returns {boolean} Whether or not the Assessment is applicable.
 */
Assessor.prototype.isApplicable = function( assessment, paper, researcher ) {
	if ( assessment.hasOwnProperty( "isApplicable" ) ) {
		return assessment.isApplicable( paper, researcher );
	}

},{"./_nativeCreate":268}],240:[function(require,module,exports){
var baseTimes = require('./_baseTimes'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isLength = require('./isLength'),
    isString = require('./isString');

/**
 * Determines whether or not an assessment has a marker
 *
 * @param {Object} assessment The assessment to check for.
 * @returns {boolean} Whether or not the assessment has a marker.
 */
Assessor.prototype.hasMarker = function( assessment ) {
	return isFunction( this._options.marker ) && assessment.hasOwnProperty( "getMarks" );
};

/**
 * Returns the specific marker for this assessor
 *
 * @returns {Function} The specific marker for this assessor.
 */
Assessor.prototype.getSpecificMarker = function() {
	return this._options.marker;
};

},{"./_baseTimes":198,"./isArguments":298,"./isArray":299,"./isLength":306,"./isString":312}],241:[function(require,module,exports){
/**
 * Returns the paper that was most recently assessed
 *
 * @returns {Paper} The paper that was most recently assessed.
 */
Assessor.prototype.getPaper = function() {
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
Assessor.prototype.getMarker = function( assessment, paper, researcher ) {
	var specificMarker = this._options.marker;

	return function() {
		var marks = assessment.getMarks( paper, researcher );

},{}],242:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

		specificMarker( paper, marks );
	};
};

/**
 * Runs the researches defined in the tasklist or the default researches.
 * @param {Paper} paper The paper to run assessments on.
 */
Assessor.prototype.assess = function( paper ) {
	var researcher = new Researcher( paper );
	var assessments = this.getAvailableAssessments();
	this.results = [];

},{}],243:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer'),
    cloneDataView = require('./_cloneDataView'),
    cloneMap = require('./_cloneMap'),
    cloneRegExp = require('./_cloneRegExp'),
    cloneSet = require('./_cloneSet'),
    cloneSymbol = require('./_cloneSymbol'),
    cloneTypedArray = require('./_cloneTypedArray');

	this.results = map( assessments, this.executeAssessment.bind( this, paper, researcher ) );

	this._lastPaper = paper;
};

/**
 * Executes an assessment and returns the AssessmentResult
 *
 * @param {Paper} paper The paper to pass to the assessment.
 * @param {Researcher} researcher The researcher to pass to the assessment.
 * @param {Object} assessment The assessment to execute.
 * @returns {AssessmentResult} The result of the assessment.
 */
Assessor.prototype.executeAssessment = function( paper, researcher, assessment ) {
	var result;

	try {
		result = assessment.getResult( paper, researcher, this.i18n );

		result.setIdentifier( assessment.identifier );

		if ( result.hasMarks() && this.hasMarker( assessment ) ) {
			result.setMarker( this.getMarker( assessment, paper, researcher ) );
		}
	} catch ( assessmentError ) {
		showTrace( assessmentError );

		result = new AssessmentResult();

		result.setScore( 0 );
		result.setText( this.i18n.sprintf(
			/* translators: %1$s expands to the name of the assessment. */
			this.i18n.dgettext( "js-text-analysis", "An error occured in the '%1$s' assessment" ),
			assessment.identifier,
			assessmentError
		) );
	}

	return result;
};

/**
 * Filters out all assessmentresults that have no score and no text.
 * @returns {Array<AssessmentResult>} The array with all the valid assessments.
 */
Assessor.prototype.getValidResults = function() {
	return filter( this.results, function( result ) {
		return this.isValidResult( result );
	}.bind( this ) );
};

},{"./_cloneArrayBuffer":206,"./_cloneDataView":208,"./_cloneMap":209,"./_cloneRegExp":210,"./_cloneSet":211,"./_cloneSymbol":212,"./_cloneTypedArray":213}],244:[function(require,module,exports){
var baseCreate = require('./_baseCreate'),
    getPrototype = require('./_getPrototype'),
    isPrototype = require('./_isPrototype');

/**
 * Returns the overallscore. Calculates the totalscore by adding all scores and dividing these
 * by the number of results times the ScoreRating.
 *
 * @returns {number} The overallscore
 */
Assessor.prototype.calculateOverallScore  = function() {
	var results = this.getValidResults();
	var totalScore = 0;

	forEach( results, function( assessmentResult ) {
		totalScore += assessmentResult.getScore();
	} );

},{"./_baseCreate":168,"./_getPrototype":230,"./_isPrototype":252}],245:[function(require,module,exports){
var isArguments = require('./isArguments'),
    isArray = require('./isArray');

/**
 * Register an assessment to add it to the internal assessments object.
 *
 * @param {string} name The name of the assessment.
 * @param {object} assessment The object containing function to run as an assessment and it's requirements.
 * @returns {boolean} Whether registering the assessment was successful.
 * @private
 */
Assessor.prototype.addAssessment = function( name, assessment ) {
	if ( !assessment.hasOwnProperty( "identifier" ) ) {
		assessment.identifier = name;
	}

	this._assessments.push( assessment );
	return true;
};

},{"./isArguments":298,"./isArray":299}],246:[function(require,module,exports){
/**
 * Remove a specific Assessment from the list of Assessments.
 * @param {string} name The Assessment to remove from the list of assessments.
 */
Assessor.prototype.removeAssessment = function( name ) {
	var toDelete = findIndex( this._assessments, function( assessment ) {
		return assessment.hasOwnProperty( "identifier" ) && name === assessment.identifier;
	} );

	if ( -1 !== toDelete ) {
		this._assessments.splice( toDelete, 1 );
	}
};

},{}],247:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

module.exports = Assessor;

},{"./errors/missingArgument":274,"./helpers/errors.js":276,"./markers/removeDuplicateMarks":283,"./researcher.js":287,"./values/AssessmentResult.js":361,"lodash/filter":173,"lodash/find":174,"lodash/findIndex":175,"lodash/forEach":176,"lodash/isFunction":190,"lodash/isUndefined":200,"lodash/map":203}],262:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var isUndefined = require( "lodash/isUndefined" );

var MissingArgument = require( "../../js/errors/missingArgument" );
/**
 * @param {object} app The app
 * @param {object} args An arguments object with usedKeywords, searchUrl, postUrl,
 * @param {object} args.usedKeywords An object with keywords and ids where they are used.
 * @param {string} args.searchUrl The url used to link to a search page when multiple usages of the keyword are found.
 * @param {string} args.postUrl The url used to link to a post when 1 usage of the keyword is found.
 * @constructor
 */
var PreviouslyUsedKeyword = function( app, args ) {
	if ( isUndefined( app ) ) {
		throw new MissingArgument( "The previously keyword plugin requires the YoastSEO app" );
	}

	if ( isUndefined( args ) ) {
		args = {
			usedKeywords: {},
			searchUrl: "",
			postUrl: ""
		};
	}

},{}],248:[function(require,module,exports){
var eq = require('./eq'),
    isArrayLike = require('./isArrayLike'),
    isIndex = require('./_isIndex'),
    isObject = require('./isObject');

/**
 * Registers the assessment with the assessor.
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

},{"./_isIndex":247,"./eq":287,"./isArrayLike":300,"./isObject":309}],249:[function(require,module,exports){
var isArray = require('./isArray'),
    isSymbol = require('./isSymbol');

/**
 * Updates the usedKeywords
 * @param {object} usedKeywords An object with keywords and ids where they are used.
 */
PreviouslyUsedKeyword.prototype.updateKeywordUsage = function( usedKeywords ) {
	this.usedKeywords = usedKeywords;
};

/**
 * Scores the previously used keyword assessment based on the count.
 *
 * @param {object} previouslyUsedKeywords The result of the previously used keywords research
 * @param {Paper} paper The paper object to research.
 * @param {Jed} i18n The i18n object.
 * @returns {object} the scoreobject with text and score.
 */
PreviouslyUsedKeyword.prototype.scoreAssessment = function( previouslyUsedKeywords, paper, i18n ) {
	var count = previouslyUsedKeywords.count;
	var id = previouslyUsedKeywords.id;
	if( count === 0 ) {
		return {
			text: i18n.dgettext( "js-text-analysis", "You've never used this focus keyword before, very good." ),
			score: 9
		};
	}
	if( count === 1 ) {
		var url = "<a href='" + this.postUrl.replace( "{id}", id ) + "' target='_blank'>";
		return {
			/* translators: %1$s and %2$s expand to an admin link where the focus keyword is already used */
			text:  i18n.sprintf( i18n.dgettext( "js-text-analysis", "You've used this focus keyword %1$sonce before%2$s, " +
				"be sure to make very clear which URL on your site is the most important for this keyword." ), url, "</a>" ),
			score: 6
		};
	}
	if ( count > 1 ) {
		url = "<a href='" + this.searchUrl.replace( "{keyword}", paper.getKeyword() )+ "' target='_blank'>";
		return {
			/* translators: %1$s and $3$s expand to the admin search page for the focus keyword, %2$d expands to the number of times this focus
			 keyword has been used before, %4$s and %5$s expand to a link to an article on yoast.com about cornerstone content */
			text:  i18n.sprintf( i18n.dgettext( "js-text-analysis", "You've used this focus keyword %1$s%2$d times before%3$s, " +
				"it's probably a good idea to read %4$sthis post on cornerstone content%5$s and improve your keyword strategy." ),
				url, count, "</a>", "<a href='https://yoast.com/cornerstone-content-rank/' target='_blank'>", "</a>" ),
			score: 1
		};
	}
};

},{"./isArray":299,"./isSymbol":313}],250:[function(require,module,exports){
/**
 * Researches the previously used keywords, based on the used keywords and the keyword in the paper.
 *
 * @param {Paper} paper The paper object to research.
 * @returns {{id: number, count: number}} The object with the count and the id of the previously used keyword
 */
PreviouslyUsedKeyword.prototype.researchPreviouslyUsedKeywords = function( paper ) {
	var keyword = paper.getKeyword();
	var count = 0;
	var id = 0;

},{}],251:[function(require,module,exports){
var coreJsData = require('./_coreJsData');

	return {
		id: id,
		count: count
	};
};

/**
 * The assessment for the previously used keywords.
 *
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The assessment result of the assessment
 */
PreviouslyUsedKeyword.prototype.assess = function( paper, researcher, i18n ) {
	var previouslyUsedKeywords = this.researchPreviouslyUsedKeywords( paper );
	var previouslyUsedKeywordsResult = this.scoreAssessment( previouslyUsedKeywords, paper, i18n );

	var assessmentResult =  new AssessmentResult();
	assessmentResult.setScore( previouslyUsedKeywordsResult.score );
	assessmentResult.setText( previouslyUsedKeywordsResult.text );

},{"./_coreJsData":217}],252:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

module.exports = PreviouslyUsedKeyword;

},{"../../js/errors/missingArgument":274,"../values/AssessmentResult.js":361,"lodash/isUndefined":200}],263:[function(require,module,exports){
var analyzerConfig = {
	queue: [ "wordCount", "keywordDensity", "subHeadings", "stopwords", "fleschReading", "linkCount", "imageCount", "urlKeyword", "urlLength", "metaDescriptionLength", "metaDescriptionKeyword", "pageTitleKeyword", "pageTitleLength", "firstParagraph", "urlStopwords", "keywordDoubles", "keyphraseSizeCheck" ],
	stopWords: [ "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from", "further", "had", "has", "have", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "it", "it's", "its", "itself", "let's", "me", "more", "most", "my", "myself", "nor", "of", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "she'd", "she'll", "she's", "should", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "we'd", "we'll", "we're", "we've", "were", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "would", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves" ],
	wordsToRemove: [ " a", " in", " an", " on", " for", " the", " and" ],
	maxSlugLength: 20,
	maxUrlLength: 40,
	maxMeta: 156
};

module.exports = analyzerConfig;

},{}],253:[function(require,module,exports){
var isObject = require('./isObject');

/**
 * Returns the diacritics map
 *
 * @returns {array} diacritics map
 */
module.exports = function() {
	return [
		{
			base: "a",
			letters: /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g
		},
		{ base: "aa", letters: /[\uA733]/g },
		{ base: "ae", letters: /[\u00E6\u01FD\u01E3]/g },
		{ base: "ao", letters: /[\uA735]/g },
		{ base: "au", letters: /[\uA737]/g },
		{ base: "av", letters: /[\uA739\uA73B]/g },
		{ base: "ay", letters: /[\uA73D]/g },
		{ base: "b", letters: /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g },
		{
			base: "c",
			letters: /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g
		},
		{
			base: "d",
			letters: /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g
		},
		{ base: "dz", letters: /[\u01F3\u01C6]/g },
		{
			base: "e",
			letters: /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g
		},
		{ base: "f", letters: /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g },
		{
			base: "g",
			letters: /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g
		},
		{
			base: "h",
			letters: /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g
		},
		{ base: "hv", letters: /[\u0195]/g },
		{
			base: "i",
			letters: /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g
		},
		{ base: "j", letters: /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g },
		{
			base: "k",
			letters: /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g
		},
		{
			base: "l",
			letters: /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g
		},
		{ base: "lj", letters: /[\u01C9]/g },
		{ base: "m", letters: /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g },
		{
			base: "n",
			letters: /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g
		},
		{ base: "nj", letters: /[\u01CC]/g },
		{
			base: "o",
			letters: /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g
		},
		{ base: "oi", letters: /[\u01A3]/g },
		{ base: "ou", letters: /[\u0223]/g },
		{ base: "oo", letters: /[\uA74F]/g },
		{ base: "p", letters: /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g },
		{ base: "q", letters: /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g },
		{
			base: "r",
			letters: /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g
		},
		{
			base: "s",
			letters: /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g
		},
		{
			base: "t",
			letters: /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g
		},
		{ base: "tz", letters: /[\uA729]/g },
		{
			base: "u",
			letters: /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g
		},
		{ base: "v", letters: /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g },
		{ base: "vy", letters: /[\uA761]/g },
		{
			base: "w",
			letters: /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g
		},
		{ base: "x", letters: /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g },
		{
			base: "y",
			letters: /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g
		},
		{
			base: "z",
			letters: /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g
		}
	];
};

},{"./isObject":309}],254:[function(require,module,exports){
/**
 * Returns the configuration used for score ratings and the AssessorPresenter.
 * @param {Jed} i18n The translator object.
 * @returns {Object} The config object.
 */
module.exports = function ( i18n ) {
	return {
		feedback: {
			className: "na",
			screenReaderText: i18n.dgettext( "js-text-analysis", "Feedback" ),
			fullText: i18n.dgettext( "js-text-analysis", "Content Analysis: Has feedback" )
		},
		bad: {
			className: "bad",
			screenReaderText: i18n.dgettext( "js-text-analysis", "Bad SEO score" ),
			fullText: i18n.dgettext( "js-text-analysis", "Content Analysis: Bad SEO score" )
		},
		ok: {
			className: "ok",
			screenReaderText: i18n.dgettext( "js-text-analysis", "OK SEO score" ),
			fullText: i18n.dgettext( "js-text-analysis", "Content Analysis: OK SEO score" )
		},
		good: {
			className: "good",
			screenReaderText: i18n.dgettext( "js-text-analysis", "Good SEO score" ),
			fullText: i18n.dgettext( "js-text-analysis", "Content Analysis: Good SEO score" )
		}
	};
};

},{}],266:[function(require,module,exports){
/** @module config/removalWords */

},{}],255:[function(require,module,exports){
/**
 * Returns an array with words that need to be removed
 *
 * @returns {array} removalWords Returns an array with words.
 */
function listCacheClear() {
  this.__data__ = [];
}

module.exports = listCacheClear;

},{}],256:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/** Used for built-in method references. */
var arrayProto = Array.prototype;

},{}],267:[function(require,module,exports){
/** @module config/stopwords */

/**
 * Returns an array with stopwords to be used by the analyzer.
 *
 * @returns {Array} stopwords The array filled with stopwords.
 */
module.exports = function() {
	return [ "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from", "further", "had", "has", "have", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "it", "it's", "its", "itself", "let's", "me", "more", "most", "my", "myself", "nor", "of", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "she'd", "she'll", "she's", "should", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "we'd", "we'll", "we're", "we've", "were", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "would", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves" ];
};

},{"./_assocIndexOf":165}],257:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Returns an array with syllables.
 * Subtractsyllables are counted as two and need to be counted as one.
 * Addsyllables are counted as one but need to be counted as two.
 * Exclusionwords are removed from the text to be counted seperatly.
 *
 * @returns {object}
 */
module.exports = function() {
	return {
		subtractSyllables: [ "cial", "tia", "cius", "cious", "giu", "ion", "iou", "sia$", "[^aeiuoyt]{2,}ed$", "[aeiouy][^aeiuoyts]{1,}e\\b", ".ely$", "[cg]h?e[sd]", "rved$", "rved", "[aeiouy][dt]es?$", "[aeiouy][^aeiouydt]e[sd]?$", "^[dr]e[aeiou][^aeiou]+$", "[aeiouy]rse$" ],
		addSyllables: [ "ia", "riet", "dien", "iu", "io", "ii", "[aeiouym][bdp]l", "[aeiou]{3}", "^mc", "ism$", "([^aeiouy])\1l$", "[^l]lien", "^coa[dglx].", "[^gq]ua[^auieo]", "dnt$", "uity$", "ie(r|st)", "[aeiouy]ing", "[aeiouw]y[aeiou]" ],
		exclusionWords: [
			{ word: "shoreline", syllables: 2 },
			{ word: "simile", syllables: 3 }
		]
	};
};

},{"./_assocIndexOf":165}],258:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Returns an array with transition words to be used by the assessments.
 * @returns {Array} The array filled with transition words.
 */
module.exports = function() {
	return [ "above all", "accordingly", "additionally", "after all", "after that", "afterward", "afterwards", "albeit", "all in all", "all of a sudden", "all things considered", "also", "although", "although this may be true", "altogether", "analogous to", "another", "another key point", "as", "as a matter of fact", "as a result", "as an illustration", "as can be seen", "as has been noted", "as I have noted", "as I have said", "as I have shown", "as long as", "as much as", "as shown above", "as soon as", "as well as", "at any rate", "at first", "at last", "at least", "at length", "at the present time", "at the same time", "at this instant", "at this point", "at this time", "balanced against", "basically", "be that as it may", "because", "before", "being that", "besides", "but", "by all means", "by and large", "by comparison", "by the same token", "by the time", "certainly", "chiefly", "comparatively", "compared to", "concurrently", "consequently", "contrarily", "conversely", "correspondingly", "coupled with", "despite", "different from", "doubtedly", "due to", "during", "e.g.", "earlier", "emphatically", "equally", "equally important", "especially", "even if", "even more", "even so", "even though", "eventually", "evidently", "explicitly", "finally", "first", "first thing to remember", "firstly", "following", "for example", "for fear that", "for instance", "for one thing", "for that reason", "for the most part", "for the purpose of", "for the same reason", "for this purpose", "for this reason", "formerly", "forthwith", "fourth", "fourthly", "from time to time", "further", "furthermore", "generally", "given that", "given these points", "granted", "hence", "henceforth", "however", "i.e.", "identically", "important to realize", "in a word", "in addition", "in another case", "in any case", "in any event", "in brief", "in case", "in conclusion", "in contrast", "in detail", "in due time", "in effect", "in either case", "in essence", "in fact", "in general", "in light of", "in like fashion", "in like manner", "in order that", "in order to", "in other words", "in particular", "in reality", "in short", "in similar fashion", "in spite of", "in sum", "in summary", "in that case", "in the event that", "in the final analysis", "in the first place", "in the fourth place", "in the hope that", "in the light of", "in the long run", "in the meantime", "in the same fashion", "in the same way", "in the second place", "in the third place", "in this case", "in this situation", "in time", "in truth", "in view of", "inasmuch as", "indeed", "instead", "last", "lastly", "later", "lest", "likewise", "markedly", "meanwhile", "moreover", "most compelling evidence", "most important", "must be remembered", "nevertheless", "nonetheless", "nor", "not to mention",  "notwithstanding", "now that", "obviously", "occasionally", "of course", "on account of", "on balance", "on condition that", "on one hand", "on the condition that", "on the contrary", "on the negative side", "on the other hand", "on the positive side", "on the whole", "on this occasion", "once", "once in a while", "only if", "otherwise", "overall", "owing to", "particularly", "point often overlooked", "presently", "previously", "prior to", "provided that", "rather", "regardless", "second", "secondly", "seeing that", "shortly", "significantly", "similarly", "simultaneously", "since", "so", "so as to", "so far", "so long as", "so that", "soon", "sooner or later", "specifically", "still", "straightaway", "subsequently", "such as", "summing up", "surely", "surprisingly", "take the case of", "than", "that is", "that is to say", "then", "then again", "thereafter", "therefore", "thereupon", "third", "thirdly", "this time", "though", "thus", "till", "to be sure", "to begin with", "to clarify", "to conclude", "to demonstrate", "to emphasize", "to enumerate", "to explain", "to illustrate", "too", "to list", "to point out", "to put it another way", "to put it differently", "to repeat", "to rephrase it", "to say nothing of", "to sum up", "to summarize", "to that end", "to the end that", "to this end", "together with", "undeniably", "under those circumstances", "undoubtedly", "unless", "unlike", "unquestionably", "until", "until now", "up against", "up to the present time", "vis a vis", "what's more", "when", "whenever", "whereas", "while", "while it may be true", "while this may be true", "with attention to", "with the result that", "with this in mind", "with this intention", "with this purpose in mind", "without a doubt", "without delay", "without doubt", "without reservation" ];
};


},{"./_assocIndexOf":165}],259:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * The function getting the language part of the locale.
 *
 * @param {string} locale The locale.
 * @returns {string} The language part of the locale.
 */
var getLanguage = function ( locale ) {
	return locale.split( "_" )[ 0 ];
};

var transliterations = {

},{"./_assocIndexOf":165}],260:[function(require,module,exports){
var Hash = require('./_Hash'),
    ListCache = require('./_ListCache'),
    Map = require('./_Map');

/**
 * The function returning an array containing transliteration objects, based on the given locale.
 *
 * @param {string} locale The locale.
 * @returns {Array} An array containing transliteration objects.
 */
module.exports = function( locale ) {
	if ( isUndefined( locale ) ) {
		return [];
	}
	switch( getLanguage( locale ) ) {
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
		default:
			return [];
	}
};

},{"./_Hash":139,"./_ListCache":140,"./_Map":141}],261:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Returns an array with two-part transition words to be used by the assessments.
 * @returns {Array} The array filled with two-part transition words.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

module.exports = mapCacheDelete;

},{"./_getMapData":227}],262:[function(require,module,exports){
var getMapData = require('./_getMapData');


},{}],272:[function(require,module,exports){
var Assessor = require( "./assessor.js" );

},{"./_getMapData":227}],263:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
var ContentAssessor = function( i18n, options ) {
	Assessor.call( this, i18n, options );

	this._assessments = [
		fleschReadingEase,
		wordComplexity,
		getSubheadingPresence,
		textSubheadings,
		subheadingDistributionTooLong,
		subheadingDistributionTooShort,
		subHeadingLength,
		paragraphTooLong,
		paragraphTooShort,
		sentenceLengthInText,
		sentenceLengthInDescription,
		transitionWords,
		sentenceVariation,
		sentenceBeginnings,
		passiveVoice
	];
};

},{"./_getMapData":227}],264:[function(require,module,exports){
var getMapData = require('./_getMapData');

require( "util" ).inherits( module.exports, Assessor );


},{"./_getMapData":227}],265:[function(require,module,exports){
/**
 * Throws an invalid type error
 * @param {string} message The message to show when the error is thrown
 * @returns {void}
 */
module.exports = function InvalidTypeError( message ) {
	Error.captureStackTrace( this, this.constructor );
	this.name = this.constructor.name;
	this.message = message;
};

require( "util" ).inherits( module.exports, Error );

},{}],266:[function(require,module,exports){
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

require( "util" ).inherits( module.exports, Error );

},{}],267:[function(require,module,exports){
var baseMerge = require('./_baseMerge'),
    isObject = require('./isObject');

/**
 * Adds a class to an element
 *
 * @param {HTMLElement} element The element to add the class to.
 * @param {string} className The class to add.
 * @returns {void}
 */
function mergeDefaults(objValue, srcValue, key, object, source, stack) {
  if (isObject(objValue) && isObject(srcValue)) {
    baseMerge(objValue, srcValue, undefined, mergeDefaults, stack.set(srcValue, objValue));
  }
  return objValue;
}

module.exports = mergeDefaults;

},{"./_baseMerge":192,"./isObject":309}],268:[function(require,module,exports){
var getNative = require('./_getNative');

	if ( -1 === classes.indexOf( className ) ) {
		classes.push( className );
	}

	element.className = classes.join( " " );
};

},{"./_getNative":229}],269:[function(require,module,exports){
(function (global){
var checkGlobal = require('./_checkGlobal');

	if ( -1 !== foundClass ) {
		classes.splice( foundClass, 1 );
	}

	element.className = classes.join( " " );
};

/**
 * Removes multiple classes from an element
 *
 * @param {HTMLElement} element The element to remove the classes from.
 * @param {Array} classes A list of classes to remove
 * @returns {void}
 */
var removeClasses = function( element, classes ) {
	forEach( classes, this.removeClass.bind( null, element ) );
};

/**
 * Checks whether an element has a specific class.
 *
 * @param {HTMLElement} element The element to check for the class.
 * @param {string} className The class to look for.
 * @returns {boolean} Whether or not the class is present.
 */
var hasClass = function( element, className ) {
	return element.className.indexOf( className ) > -1;
};

module.exports = {
	hasClass: hasClass,
	addClass: addClass,
	removeClass: removeClass,
	removeClasses: removeClasses
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./_checkGlobal":205}],270:[function(require,module,exports){
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Shows and error trace of the error message in the console if the console is available.
 *
 * @param {string} [errorMessage=""] The error message.
 */
function showTrace( errorMessage ) {
	if ( isUndefined( errorMessage ) ) {
		errorMessage = "";
	}

	if (
		!isUndefined( console ) &&
		!isUndefined( console.trace )
	) {
		console.trace( errorMessage );
	}
}

module.exports = {
	showTrace: showTrace
};

},{}],271:[function(require,module,exports){
/**
 * Returns rounded number to fix floating point bug http://floating-point-gui.de
 * @param {number} number The unrounded number
 * @returns {number} Rounded number
 */
module.exports = function ( number ) {
	return Math.round( number * 100 ) / 100;
};

},{}],278:[function(require,module,exports){
/**
 * Returns true or false, based on the length of the value text and the recommended value.
 *
 * @param {number} recommendedValue The recommended value.
 * @param {number} valueLength      The length of the value to check.
 * @returns {boolean} True if the length is greater than the recommendedValue, false if it is smaller.
 */
module.exports = function( recommendedValue, valueLength ) {
	return valueLength > recommendedValue;
};

},{}],279:[function(require,module,exports){
/**
 * Returns true or false, based on the length of the value text and the recommended value.
 *
 * @param {number} recommendedValue The recommended value.
 * @param {number} valueLength      The length of the value to check.
 * @returns {boolean} True if the length is smaller than the recommendedValue, false if it is bigger.
 */
module.exports = function( recommendedValue, valueLength ) {
	return valueLength < recommendedValue;
};

},{}],272:[function(require,module,exports){
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

},{}],273:[function(require,module,exports){
var ListCache = require('./_ListCache');

},{}],281:[function(require,module,exports){
/**
 * Returns an array with exceptions for the sentence beginning researcher.
 * @returns {Array} The array filled with exceptions.
 */
module.exports = function() {
	return [ "A", "An", "The", "This", "That", "These", "Those", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten" ];
};

},{}],282:[function(require,module,exports){
/**
 * Marks a text with HTML tags
 *
 * @param {string} text The unmarked text.
 * @returns {string} The marked text.
 */
module.exports = function( text ) {
	return "<yoastmark class='yoast-text-mark'>" + text + "</yoastmark>";
};

},{}],283:[function(require,module,exports){
var uniqBy = require( "lodash/uniqBy" );

},{"./_ListCache":140}],274:[function(require,module,exports){
/**
 * Removes duplicate marks from an array
 *
 * @param {Array} marks The marks to remove duplications from
 * @returns {Array} A list of de-duplicated marks.
 */
function removeDuplicateMarks( marks ) {
	return uniqBy( marks, function( mark ) {
		return mark.getOriginal();
	} );
}

module.exports = removeDuplicateMarks;

},{}],275:[function(require,module,exports){
/**
 * Removes all marks from a text
 *
 * @param {string} text The marked text.
 * @returns {string} The unmarked text.
 */
module.exports = function( text ) {
	return text
		.replace( new RegExp( "<yoastmark[^>]*>", "g" ), "" )
		.replace( new RegExp( "</yoastmark>", "g" ), "" );
};

},{}],285:[function(require,module,exports){
/* global console: true */
/* global setTimeout: true */
var isUndefined = require( "lodash/isUndefined" );
var forEach = require( "lodash/forEach" );
var reduce = require( "lodash/reduce" );
var isString = require( "lodash/isString" );
var isObject = require( "lodash/isObject" );
var InvalidTypeError = require( "./errors/invalidType" );

},{}],276:[function(require,module,exports){
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

/**
 * Setup Pluggable and set its default values.
 *
 * @constructor
 * @param       {App}       app                 The App object to attach to.
 * @property    {number}    preloadThreshold	The maximum time plugins are allowed to preload before we load our content analysis.
 * @property    {object}    plugins             The plugins that have been registered.
 * @property    {object}    modifications 	    The modifications that have been registered. Every modification contains an array with callables.
 * @property    {Array}     customTests         All tests added by plugins.
 */
var Pluggable = function( app ) {
	this.app = app;
	this.loaded = false;
	this.preloadThreshold = 3000;
	this.plugins = {};
	this.modifications = {};
	this.customTests = [];

},{}],277:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    MapCache = require('./_MapCache');

//  ***** DSL IMPLEMENTATION ***** //

/**
 * Register a plugin with YoastSEO. A plugin can be declared "ready" right at registration or later using `this.ready`.
 *
 * @param {string}  pluginName      The name of the plugin to be registered.
 * @param {object}  options         The options passed by the plugin.
 * @param {string}  options.status  The status of the plugin being registered. Can either be "loading" or "ready".
 * @returns {boolean}               Whether or not the plugin was successfully registered.
 */
Pluggable.prototype._registerPlugin = function( pluginName, options ) {
	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to register plugin. Expected parameter `pluginName` to be a string." );
		return false;
	}

},{"./_ListCache":140,"./_MapCache":142}],278:[function(require,module,exports){
var memoize = require('./memoize'),
    toString = require('./toString');

	if ( this._validateUniqueness( pluginName ) === false ) {
		console.error( "Failed to register plugin. Plugin with name " + pluginName + " already exists" );
		return false;
	}

	this.plugins[ pluginName ] = options;
	this.app.updateLoadingDialog( this.plugins );
	return true;
};

/**
 * Declare a plugin "ready". Use this if you need to preload data with AJAX.
 *
 * @param {string} pluginName	The name of the plugin to be declared as ready.
 * @returns {boolean}           Whether or not the plugin was successfully declared ready.
 */
Pluggable.prototype._ready = function( pluginName ) {
	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to modify status for plugin " + pluginName + ". Expected parameter `pluginName` to be a string." );
		return false;
	}

},{"./memoize":319,"./toString":335}],279:[function(require,module,exports){
var isSymbol = require('./isSymbol');

	this.plugins[ pluginName ].status = "ready";
	this.app.updateLoadingDialog( this.plugins );
	return true;
};

/**
 * Used to declare a plugin has been reloaded. If an analysis is currently running. We will reset it to ensure running the latest modifications.
 *
 * @param {string} pluginName   The name of the plugin to be declared as reloaded.
 * @returns {boolean}           Whether or not the plugin was successfully declared as reloaded.
 */
Pluggable.prototype._reloaded = function( pluginName ) {
	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to reload Content Analysis for " + pluginName + ". Expected parameter `pluginName` to be a string." );
		return false;
	}

	if ( isUndefined( this.plugins[ pluginName ] ) ) {
		console.error( "Failed to reload Content Analysis for plugin " + pluginName + ". The plugin was not properly registered." );
		return false;
	}

},{"./isSymbol":313}],280:[function(require,module,exports){
/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/**
 * Enables hooking a callable to a specific data filter supported by YoastSEO. Can only be performed for plugins that have finished loading.
 *
 * @param {string}      modification	The name of the filter
 * @param {function}    callable 	    The callable
 * @param {string}      pluginName 	    The plugin that is registering the modification.
 * @param {number}      priority	    (optional) Used to specify the order in which the callables associated with a particular filter are called.
 * 									    Lower numbers correspond with earlier execution.
 * @returns {boolean}                   Whether or not applying the hook was successfull.
 */
Pluggable.prototype._registerModification = function( modification, callable, pluginName, priority ) {
	if ( typeof modification !== "string" ) {
		console.error( "Failed to register modification for plugin " + pluginName + ". Expected parameter `modification` to be a string." );
		return false;
	}

	if ( typeof callable !== "function" ) {
		console.error( "Failed to register modification for plugin " + pluginName + ". Expected parameter `callable` to be a function." );
		return false;
	}

},{}],281:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    createAssigner = require('./_createAssigner'),
    keysIn = require('./keysIn');

	// Validate origin
	if ( this._validateOrigin( pluginName ) === false ) {
		console.error( "Failed to register modification for plugin " + pluginName + ". The integration has not finished loading yet." );
		return false;
	}

	// Default priority to 10
	var prio = typeof priority === "number" ?  priority : 10;

},{"./_copyObject":215,"./_createAssigner":218,"./keysIn":317}],282:[function(require,module,exports){
var baseClone = require('./_baseClone');

/**
 * Register test for a specific plugin
 *
 * @deprecated
 */
Pluggable.prototype._registerTest = function() {
	console.error( "This function is deprecated, please use _registerAssessment" );
};

/**
 * Register an assessment for a specific plugin
 *
 * @param {object} assessor The assessor object where the assessments needs to be added.
 * @param {string} name The name of the assessment.
 * @param {function} assessment The function to run as an assessment.
 * @param {string} pluginName The name of the plugin associated with the assessment.
 * @returns {boolean} Whether registering the assessment was successful.
 * @private
 */
Pluggable.prototype._registerAssessment = function( assessor, name, assessment, pluginName ) {
	if ( !isString( name ) ) {
		throw new InvalidTypeError( "Failed to register test for plugin " + pluginName + ". Expected parameter `name` to be a string." );
	}

	if ( !isObject( assessment ) ) {
		throw new InvalidTypeError( "Failed to register assessment for plugin " + pluginName +
			". Expected parameter `assessment` to be a function." );
	}

},{"./_baseClone":167}],283:[function(require,module,exports){
var isObject = require('./isObject'),
    now = require('./now'),
    toNumber = require('./toNumber');

	// Prefix the name with the pluginName so the test name is always unique.
	name = pluginName + "-" + name;

	assessor.addAssessment( name, assessment );

	return true;
};

// ***** PRIVATE HANDLERS *****//

/**
 * Poller to handle loading of plugins. Plugins can register with our app to let us know they are going to hook into our Javascript. They are allowed
 * 5 seconds of pre-loading time to fetch all the data they need to be able to perform their data modifications. We will only apply data modifications
 * from plugins that have declared ready within the pre-loading time in order to safeguard UX and data integrity.
 *
 * @param   {number} pollTime (optional) The accumulated time to compare with the pre-load threshold.
 * @returns {void}
 * @private
 */
Pluggable.prototype._pollLoadingPlugins = function( pollTime ) {
	pollTime = isUndefined( pollTime ) ? 0 : pollTime;
	if ( this._allReady() === true ) {
		this.loaded = true;
		this.app.pluginsLoaded();
	} else if ( pollTime >= this.preloadThreshold ) {
		this._pollTimeExceeded();
	} else {
		pollTime += 50;
		setTimeout( this._pollLoadingPlugins.bind( this, pollTime ), 50 );
	}
};

/**
 * Checks if all registered plugins have finished loading
 *
 * @returns {boolean} Whether or not all registered plugins are loaded.
 * @private
 */
Pluggable.prototype._allReady = function() {
	return reduce( this.plugins, function( allReady, plugin ) {
		return allReady && plugin.status === "ready";
	}, true );
};

/**
 * Removes the plugins that were not loaded within time and calls `pluginsLoaded` on the app.
 *
 * @returns {void}
 * @private
 */
Pluggable.prototype._pollTimeExceeded = function() {
	forEach( this.plugins, function( plugin, pluginName ) {
		if ( !isUndefined( plugin.options ) && plugin.options.status !== "ready" ) {
			console.error( "Error: Plugin " + pluginName + ". did not finish loading in time." );
			delete this.plugins[ pluginName ];
		}
	} );
	this.loaded = true;
	this.app.pluginsLoaded();
};

/**
 * Calls the callables added to a modification hook. See the YoastSEO.js Readme for a list of supported modification hooks.
 *
 * @param	{string}    modification	The name of the filter
 * @param   {*}         data 		    The data to filter
 * @param   {*}         context		    (optional) Object for passing context parameters to the callable.
 * @returns {*} 		                The filtered data
 * @private
 */
Pluggable.prototype._applyModifications = function( modification, data, context ) {
	var callChain = this.modifications[ modification ];

	if ( callChain instanceof Array && callChain.length > 0 ) {
		callChain = this._stripIllegalModifications( callChain );

		callChain.sort( function( a, b ) {
			return a.priority - b.priority;
		} );
		forEach( callChain, function( callableObject ) {
			var callable = callableObject.callable;
			var newData = callable( data, context );
			if ( typeof newData === typeof data ) {
				data = newData;
			} else {
				console.error( "Modification with name " + modification + " performed by plugin with name " +
				callableObject.origin +
				" was ignored because the data that was returned by it was of a different type than the data we had passed it." );
			}
		} );
	}
	return data;

};

/**
 * Adds new tests to the analyzer and it's scoring object.
 *
 * @param {YoastSEO.Analyzer} analyzer The analyzer object to add the tests to
 * @returns {void}
 * @private
 */
Pluggable.prototype._addPluginTests = function( analyzer ) {
	this.customTests.map( function( customTest ) {
		this._addPluginTest( analyzer, customTest );
	}, this );
};

/**
 * Adds one new test to the analyzer and it's scoring object.
 *
 * @param {YoastSEO.Analyzer} analyzer              The analyzer that the test will be added to.
 * @param {Object}            pluginTest            The test to be added.
 * @param {string}            pluginTest.name       The name of the test.
 * @param {function}          pluginTest.callable   The function associated with the test.
 * @param {function}          pluginTest.analysis   The function associated with the analyzer.
 * @param {Object}            pluginTest.scoring    The scoring object to be used.
 * @returns {void}
 * @private
 */
Pluggable.prototype._addPluginTest = function( analyzer, pluginTest ) {
	analyzer.addAnalysis( {
		"name": pluginTest.name,
		"callable": pluginTest.analysis
	} );

	analyzer.analyzeScorer.addScoring( {
		"name": pluginTest.name,
		"scoring": pluginTest.scoring
	} );
};

/**
 * Strips modifications from a callChain if they were not added with a valid origin.
 *
 * @param   {Array} callChain	 The callChain that contains items with possible invalid origins.
 * @returns {Array} callChain 	 The stripped version of the callChain.
 * @private
 */
Pluggable.prototype._stripIllegalModifications = function( callChain ) {
	forEach( callChain, function( callableObject, index ) {
		if ( this._validateOrigin( callableObject.origin ) === false ) {
			delete callChain[ index ];
		}
	}.bind( this ) );

	return callChain;
};

/**
 * Validates if origin of a modification has been registered and finished preloading.
 *
 * @param 	{string}    pluginName      The name of the plugin that needs to be validated.
 * @returns {boolean}                   Whether or not the origin is valid.
 * @private
 */
Pluggable.prototype._validateOrigin = function( pluginName ) {
	if ( this.plugins[ pluginName ].status !== "ready" ) {
		return false;
	}
	return true;
};

/**
 * Validates if registered plugin has a unique name.
 *
 * @param 	{string}    pluginName      The name of the plugin that needs to be validated for uniqueness.
 * @returns {boolean}                   Whether or not the plugin has a unique name.
 * @private
 */
Pluggable.prototype._validateUniqueness = function( pluginName ) {
	if ( !isUndefined( this.plugins[ pluginName ] ) ) {
		return false;
	}
	return true;
};

module.exports = Pluggable;

},{"./errors/invalidType":273,"lodash/forEach":176,"lodash/isObject":194,"lodash/isString":197,"lodash/isUndefined":200,"lodash/reduce":211}],286:[function(require,module,exports){
/* jshint browser: true */

},{"./isObject":309,"./now":324,"./toNumber":333}],284:[function(require,module,exports){
var apply = require('./_apply'),
    assignInDefaults = require('./_assignInDefaults'),
    assignInWith = require('./assignInWith'),
    rest = require('./rest');

/**
 * Constructs the AssessorPresenter.
 *
 * @param {Object} args A list of arguments to use in the presenter.
 * @param {object} args.targets The HTML elements to render the output to.
 * @param {string} args.targets.output The HTML element to render the individual ratings out to.
 * @param {string} args.targets.overall The HTML element to render the overall rating out to.
 * @param {string} args.keyword The keyword to use for checking, when calculating the overall rating.
 * @param {SEOAssessor} args.assessor The Assessor object to retrieve assessment results from.
 * @param {Jed} args.i18n The translation object.
 *
 * @constructor
 */
var AssessorPresenter = function( args ) {
	this.keyword = args.keyword;
	this.assessor = args.assessor;
	this.i18n = args.i18n;
	this.output = args.targets.output;
	this.overall = args.targets.overall || "overallScore";
	this.presenterConfig = createConfig( args.i18n );
};

/**
 * Sets the keyword
 * @param {string} keyword The keyword to use.
 */
AssessorPresenter.prototype.setKeyword = function( keyword ) {
	this.keyword = keyword;
};

},{"./_apply":153,"./_assignInDefaults":162,"./assignInWith":281,"./rest":327}],285:[function(require,module,exports){
var apply = require('./_apply'),
    mergeDefaults = require('./_mergeDefaults'),
    mergeWith = require('./mergeWith'),
    rest = require('./rest');

/**
 * Gets a fully formatted indicator object that can be used.
 * @param {string} rating The rating to use.
 * @returns {Object} An object containing the class, the screen reader text, and the full text.
 */
AssessorPresenter.prototype.getIndicator = function( rating ) {
	return {
		className: this.getIndicatorColorClass( rating ),
		screenReaderText: this.getIndicatorScreenReaderText( rating ),
		fullText: this.getIndicatorFullText( rating )
	};
};

/**
 * Gets the indicator color class from the presenter configuration, if it exists.
 * @param {string} rating The rating to check against the config.
 * @returns {string} String containing the CSS class to be used.
 */
AssessorPresenter.prototype.getIndicatorColorClass = function( rating ) {
	if ( !this.configHasProperty( rating ) ) {
		return "";
	}

},{"./_apply":153,"./_mergeDefaults":267,"./mergeWith":321,"./rest":327}],286:[function(require,module,exports){
var baseDifference = require('./_baseDifference'),
    baseFlatten = require('./_baseFlatten'),
    isArrayLikeObject = require('./isArrayLikeObject'),
    rest = require('./rest');

/**
 * Get the indicator screen reader text from the presenter configuration, if it exists.
 * @param {string} rating The rating to check against the config.
 * @returns {string} Translated string containing the screen reader text to be used.
 */
AssessorPresenter.prototype.getIndicatorScreenReaderText = function( rating ) {
	if ( !this.configHasProperty( rating ) ) {
		return "";
	}

	return this.presenterConfig[ rating ].screenReaderText;
};

/**
 * Get the indicator full text from the presenter configuration, if it exists.
 * @param {string} rating The rating to check against the config.
 * @returns {string} Translated string containing the full text to be used.
 */
AssessorPresenter.prototype.getIndicatorFullText = function( rating ) {
	if ( !this.configHasProperty( rating ) ) {
		return "";
	}

	return this.presenterConfig[ rating ].fullText;
};

/**
 * Adds a rating based on the numeric score.
 * @param {Object} result Object based on the Assessment result. Requires a score property to work.
 * @returns {Object} The Assessment result object with the rating added.
 */
AssessorPresenter.prototype.resultToRating = function( result ) {
	if ( !isObject( result ) ) {
		return "";
	}

	result.rating = scoreToRating( result.score );

	return result;
};

},{"./_baseDifference":169,"./_baseFlatten":173,"./isArrayLikeObject":301,"./rest":327}],287:[function(require,module,exports){
/**
 * Takes the individual assessment results, sorts and rates them.
 * @returns {Object} Object containing all the individual ratings.
 */
AssessorPresenter.prototype.getIndividualRatings = function() {
	var ratings = {};
	var validResults = this.sort( this.assessor.getValidResults() );
	var mappedResults = validResults.map( this.resultToRating );

	forEach( mappedResults, function( item, key ) {
		ratings[ key ] = this.addRating( item );
	}.bind( this ) );

},{}],288:[function(require,module,exports){
var arrayFilter = require('./_arrayFilter'),
    baseFilter = require('./_baseFilter'),
    baseIteratee = require('./_baseIteratee'),
    isArray = require('./isArray');

/**
 * Excludes items from the results that are present in the exclude array.
 * @param {Array} results Array containing the items to filter through.
 * @param {Array} exclude Array of results to exclude.
 * @returns {Array} Array containing items that remain after exclusion.
 */
AssessorPresenter.prototype.excludeFromResults = function( results, exclude ) {
	return difference( results, exclude );
};

/**
 * Sorts results based on their score property and always places items considered to be unsortable, at the top.
 * @param {Array} results Array containing the results that need to be sorted.
 * @returns {Array} Array containing the sorted results.
 */
AssessorPresenter.prototype.sort = function ( results ) {
	var unsortables = this.getUndefinedScores( results );
	var sortables = this.excludeFromResults( results, unsortables );

},{"./_arrayFilter":155,"./_baseFilter":171,"./_baseIteratee":186,"./isArray":299}],289:[function(require,module,exports){
var findIndex = require('./findIndex'),
    isArrayLike = require('./isArrayLike'),
    values = require('./values');

/**
 * Returns a subset of results that have an undefined score or a score set to zero.
 * @param {Array} results The results to filter through.
 * @returns {Array} A subset of results containing items with an undefined score or where the score is zero.
 */
AssessorPresenter.prototype.getUndefinedScores = function ( results ) {
	return results.filter( function( result ) {
		return isUndefined( result.score ) || result.score === 0;
	} );
};

/**
 * Creates a rating object based on the item that is being passed.
 * @param {AssessmentResult} item The item to check and create a rating object from.
 * @returns {Object} Object containing a parsed item, including a colored indicator.
 */
AssessorPresenter.prototype.addRating = function( item ) {
	var indicator = this.getIndicator( item.rating );
	indicator.text = item.text;
	indicator.identifier = item.getIdentifier();

},{"./findIndex":290,"./isArrayLike":300,"./values":337}],290:[function(require,module,exports){
var baseFindIndex = require('./_baseFindIndex'),
    baseIteratee = require('./_baseIteratee'),
    toInteger = require('./toInteger');

	return indicator;
};

/**
 * Calculates the overall rating score based on the overall score.
 * @param {Number} overallScore The overall score to use in the calculation.
 * @returns {Object} The rating based on the score.
 */
AssessorPresenter.prototype.getOverallRating = function( overallScore ) {
	var rating = 0;

	if ( this.keyword === "" ) {
		return this.resultToRating( { score: rating } );
	}

},{"./_baseFindIndex":172,"./_baseIteratee":186,"./toInteger":332}],291:[function(require,module,exports){
var baseFlatten = require('./_baseFlatten'),
    map = require('./map');

/**
 * Deactivates all marker buttons to show they are not activated.
 */
AssessorPresenter.prototype.deactiveMarkerClasses = function() {
	var markers = document.getElementsByClassName( "assessment-results__mark" );

	// Reset all other items prior to activating the currently active marker.
	forEach( markers, function( marker ) {
		domManipulation.removeClass( marker, "icon-eye-active" );
		domManipulation.addClass( marker, "icon-eye-inactive" );
	} );
};

/**
 * Toggles the marker button class depending on its state.
 *
 * @param {HTMLElement} element The element to toggle the class on.
 */
AssessorPresenter.prototype.toggleMarkerClass = function( element ) {
	this.deactiveMarkerClasses();

},{"./_baseFlatten":173,"./map":318}],292:[function(require,module,exports){
var arrayEach = require('./_arrayEach'),
    baseEach = require('./_baseEach'),
    baseIteratee = require('./_baseIteratee'),
    isArray = require('./isArray');

/**
 * Adds an event listener for the marker button
 *
 * @param {string} identifier The identifier for the assessment the marker belongs to.
 * @param {Function} marker The marker function that can mark the assessment in the text.
 */
AssessorPresenter.prototype.addMarkerEventHandler = function( identifier, marker ) {
	var container = document.getElementById( this.output );
	var markButton = container.getElementsByClassName( "js-assessment-results__mark-" + identifier )[ 0 ];

	markButton.addEventListener( "click", function( ev ) {
		this.toggleMarkerClass( ev.target );
		marker();
	}.bind( this ) );
};

},{"./_arrayEach":154,"./_baseEach":170,"./_baseIteratee":186,"./isArray":299}],293:[function(require,module,exports){
var baseGet = require('./_baseGet');

/**
 * Adds event handlers to the mark buttons
 *
 * @param {Array} scores The list of rendered scores.
 */
AssessorPresenter.prototype.bindMarkButtons = function( scores ) {
	// Make sure the button works for every score with a marker.
	forEach( scores, function ( score ) {
		if ( score.hasOwnProperty( "marker" ) ) {
			this.addMarkerEventHandler( score.identifier, score.marker );
		}
	}.bind( this ) );
};

/**
 * Removes all marks currently on the text
 */
AssessorPresenter.prototype.removeAllMarks = function() {
	var marker = this.assessor.getSpecificMarker();

},{"./_baseGet":176}],294:[function(require,module,exports){
var baseHasIn = require('./_baseHasIn'),
    hasPath = require('./_hasPath');

/**
 * Adds event handler to remove marks button
 */
AssessorPresenter.prototype.bindRemoveMarksButton = function() {
	var container = document.getElementById( this.output );
	var removeMarksButton = container.getElementsByClassName( "js-assessment-results__remove-marks" )[ 0 ];

	removeMarksButton.addEventListener( "click", function() {
		this.removeAllMarks();
		this.deactiveMarkerClasses();
	}.bind( this ) );
};

},{"./_baseHasIn":179,"./_hasPath":234}],295:[function(require,module,exports){
/**
 * Renders out the individual ratings.
 */
AssessorPresenter.prototype.renderIndividualRatings = function() {
	var outputTarget = document.getElementById( this.output );
	var scores = this.getIndividualRatings();

	outputTarget.innerHTML = template( {
		scores: scores,
		i18n: {
			markInText: this.i18n.dgettext( "js-text-analysis", "Mark this result in the text" ),
			removeMarks: this.i18n.dgettext( "js-text-analysis", "Remove all marks from the text" )
		}
	} );

},{}],296:[function(require,module,exports){
var baseInRange = require('./_baseInRange'),
    toNumber = require('./toNumber');

/**
 * Renders out the overall rating.
 */
AssessorPresenter.prototype.renderOverallRating = function() {
	var overallRating = this.getOverallRating( this.assessor.calculateOverallScore() );
	var overallRatingElement = document.getElementById( this.overall );

	if ( !overallRatingElement ) {
		return;
	}

},{"./_baseInRange":180,"./toNumber":333}],297:[function(require,module,exports){
var baseIndexOf = require('./_baseIndexOf'),
    isArrayLike = require('./isArrayLike'),
    isString = require('./isString'),
    toInteger = require('./toInteger'),
    values = require('./values');

module.exports = AssessorPresenter;

},{"../config/presenter.js":265,"../helpers/domManipulation.js":275,"../interpreters/scoreToRating.js":280,"../templates.js":360,"lodash/difference":171,"lodash/forEach":176,"lodash/isNumber":193,"lodash/isObject":194,"lodash/isUndefined":200}],287:[function(require,module,exports){
var merge = require( "lodash/merge" );
var InvalidTypeError = require( "./errors/invalidType" );
var MissingArgument = require( "./errors/missingArgument" );
var isUndefined = require( "lodash/isUndefined" );
var isEmpty = require( "lodash/isEmpty" );

// Researches
var wordCountInText = require( "./researches/wordCountInText.js" );
var getLinkStatistics = require( "./researches/getLinkStatistics.js" );
var linkCount = require( "./researches/countLinks.js" );
var urlLength = require( "./researches/urlIsTooLong.js" );
var findKeywordInPageTitle = require( "./researches/findKeywordInPageTitle.js" );
var matchKeywordInSubheadings = require( "./researches/matchKeywordInSubheadings.js" );
var getKeywordDensity = require( "./researches/getKeywordDensity.js" );
var stopWordsInKeyword = require( "./researches/stopWordsInKeyword" );
var stopWordsInUrl = require( "./researches/stopWordsInUrl" );
var calculateFleschReading = require( "./researches/calculateFleschReading.js" );
var metaDescriptionLength = require( "./researches/metaDescriptionLength.js" );
var imageCount = require( "./researches/imageCountInText.js" );
var altTagCount = require( "./researches/imageAltTags.js" );
var keyphraseLength = require( "./researches/keyphraseLength" );
var metaDescriptionKeyword = require( "./researches/metaDescriptionKeyword.js" );
var keywordCountInUrl = require( "./researches/keywordCountInUrl" );
var findKeywordInFirstParagraph = require( "./researches/findKeywordInFirstParagraph.js" );
var pageTitleLength = require( "./researches/pageTitleLength.js" );
var wordComplexity = require( "./researches/getWordComplexity.js" );
var getParagraphLength = require( "./researches/getParagraphLength.js" );
var countSentencesFromText = require( "./researches/countSentencesFromText.js" );
var countSentencesFromDescription = require( "./researches/countSentencesFromDescription.js" );
var getSubheadingLength = require( "./researches/getSubheadingLength.js" );
var getSubheadingTextLengths = require( "./researches/getSubheadingTextLengths.js" );
var getSubheadingPresence = require( "./researches/getSubheadingPresence.js" );
var findTransitionWords = require( "./researches/findTransitionWords.js" );
var sentenceVariation = require( "./researches/sentenceVariation.js" );
var passiveVoice = require( "./researches/getPassiveVoice.js" );
var getSentenceBeginnings = require( "./researches/getSentenceBeginnings.js" );

/**
 * This contains all possible, default researches.
 * @param {Paper} paper The Paper object that is needed within the researches.
 * @constructor
 * @throws {InvalidTypeError} Parameter needs to be an instance of the Paper object.
 */
var Researcher = function( paper ) {
	this.setPaper( paper );

	this.defaultResearches = {
		"urlLength": urlLength,
		"wordCountInText": wordCountInText,
		"findKeywordInPageTitle": findKeywordInPageTitle,
		"calculateFleschReading": calculateFleschReading,
		"getLinkStatistics": getLinkStatistics,
		"linkCount": linkCount,
		"imageCount": imageCount,
		"altTagCount": altTagCount,
		"matchKeywordInSubheadings": matchKeywordInSubheadings,
		"getKeywordDensity": getKeywordDensity,
		"stopWordsInKeyword": stopWordsInKeyword,
		"stopWordsInUrl": stopWordsInUrl,
		"metaDescriptionLength": metaDescriptionLength,
		"keyphraseLength": keyphraseLength,
		"keywordCountInUrl": keywordCountInUrl,
		"firstParagraph": findKeywordInFirstParagraph,
		"metaDescriptionKeyword": metaDescriptionKeyword,
		"pageTitleLength": pageTitleLength,
		"wordComplexity": wordComplexity,
		"getParagraphLength": getParagraphLength,
		"countSentencesFromText": countSentencesFromText,
		"countSentencesFromDescription": countSentencesFromDescription,
		"getSubheadingLength": getSubheadingLength,
		"getSubheadingTextLengths": getSubheadingTextLengths,
		"getSubheadingPresence": getSubheadingPresence,
		"findTransitionWords": findTransitionWords,
		"sentenceVariation": sentenceVariation,
		"passiveVoice": passiveVoice,
		"getSentenceBeginnings": getSentenceBeginnings
	};

	this.customResearches = {};
};

},{"./_baseIndexOf":181,"./isArrayLike":300,"./isString":312,"./toInteger":332,"./values":337}],298:[function(require,module,exports){
var isArrayLikeObject = require('./isArrayLikeObject');

/**
 * Add a custom research that will be available within the Researcher.
 * @param {string} name A name to reference the research by.
 * @param {function} research The function to be added to the Researcher.
 * @throws {MissingArgument} Research name cannot be empty.
 * @throws {InvalidTypeError} The research requires a valid Function callback.
 * @returns {void}
 */
Researcher.prototype.addResearch = function( name, research ) {
	if ( isUndefined( name ) || isEmpty( name ) ) {
		throw new MissingArgument( "Research name cannot be empty" );
	}

	if ( !( research instanceof Function ) ) {
		throw new InvalidTypeError( "The research requires a Function callback." );
	}

	this.customResearches[ name ] = research;
};

/**
 * Check wheter or not the research is known by the Researcher.
 * @param {string} name The name to reference the research by.
 * @returns {boolean} Whether or not the research is known by the Researcher
 */
Researcher.prototype.hasResearch = function( name ) {
	return Object.keys( this.getAvailableResearches() ).filter(
	function( research ) {
		return research === name;
	} ).length > 0;
};

/**
 * Return all available researches.
 * @returns {Object} An object containing all available researches.
 */
Researcher.prototype.getAvailableResearches = function() {
	return merge( this.defaultResearches, this.customResearches );
};

},{"./isArrayLikeObject":301}],299:[function(require,module,exports){
/**
 * Return the Research by name.
 * @param {string} name The name to reference the research by.
 * @returns {*} Returns the result of the research or false if research does not exist.
 * @throws {MissingArgument} Research name cannot be empty.
 */
Researcher.prototype.getResearch = function( name ) {
	if ( isUndefined( name ) || isEmpty( name ) ) {
		throw new MissingArgument( "Research name cannot be empty" );
	}

	if ( !this.hasResearch( name ) ) {
		return false;
	}

},{}],300:[function(require,module,exports){
var getLength = require('./_getLength'),
    isFunction = require('./isFunction'),
    isLength = require('./isLength');

/**
 * This calculates the fleschreadingscore for a given text
 * The formula used:
 * 206.835 - 1.015 (total words / total sentences) - 84.6 ( total syllables / total words);
 *
 * @param {object} paper The paper containing the text
 * @returns {number} the score of the fleschreading test
 */
module.exports = function( paper ) {
	var text = paper.getText();
	if ( text === "" ) {
		return 0;
	}

	text = cleanText( text );
	text = stripHTMLTags( text );
	var wordCount = countWords( text );

	text = stripNumbers( text );
	var sentenceCount = countSentences( text );
	var syllableCount = countSyllables( text );
	var score = 206.835 - ( 1.015 * ( wordCount / sentenceCount ) ) - ( 84.6 * ( syllableCount / wordCount ) );

	return score.toFixed( 1 );
};

},{"./_getLength":226,"./isFunction":305,"./isLength":306}],301:[function(require,module,exports){
var isArrayLike = require('./isArrayLike'),
    isObjectLike = require('./isObjectLike');

/**
 * Checks a text for anchors and returns the number found.
 *
 * @param {object} paper The paper object containing text, keyword and url.
 * @returns {number} The number of links found in the text.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var anchors = getLinks( text );

	return anchors.length;
};

},{"./isArrayLike":300,"./isObjectLike":310}],302:[function(require,module,exports){
var root = require('./_root'),
    stubFalse = require('./stubFalse');

/**
 * Counts sentences in the description..
 * @param {Paper} paper The Paper object to get description from.
 * @returns {Array} The sentences from the text.
 */
module.exports = function( paper ) {
	var sentences = getSentences( paper.getDescription() );
	return sentencesLength( sentences );
};

},{"../stringProcessing/getSentences":338,"./../stringProcessing/sentencesLength.js":351}],291:[function(require,module,exports){
var getSentences = require( "../stringProcessing/getSentences" );
var sentencesLength = require( "./../stringProcessing/sentencesLength.js" );

/**
 * Count sentences in the text.
 * @param {Paper} paper The Paper object to get text from.
 * @returns {Array} The sentences from the text.
 */
module.exports = function( paper ) {
	var sentences = getSentences( paper.getText() );
	return sentencesLength( sentences );
};

},{"../stringProcessing/getSentences":338,"./../stringProcessing/sentencesLength.js":351}],292:[function(require,module,exports){
/** @module analyses/findKeywordInFirstParagraph */

var matchParagraphs = require( "../stringProcessing/matchParagraphs.js" );
var wordMatch = require( "../stringProcessing/matchTextWithWord.js" );

/**
 * Counts the occurrences of the keyword in the first paragraph, returns 0 if it is not found,
 * if there is no paragraph tag or 0 hits, it checks for 2 newlines, otherwise returns the keyword
 * count of the complete text.
 *
 * @param {Paper} paper The text to check for paragraphs.
 * @returns {number} The number of occurences of the keyword in the first paragraph.
 */
module.exports = function( paper ) {
	var paragraph = matchParagraphs( paper.getText() );
	return wordMatch( paragraph[ 0 ], paper.getKeyword(), paper.getLocale() );
};

},{"../stringProcessing/matchParagraphs.js":343,"../stringProcessing/matchTextWithWord.js":346}],293:[function(require,module,exports){
/** @module analyses/findKeywordInPageTitle */

},{"./_root":269,"./stubFalse":329}],303:[function(require,module,exports){
var isObjectLike = require('./isObjectLike'),
    isPlainObject = require('./isPlainObject');

/**
 * Counts the occurrences of the keyword in the pagetitle. Returns the number of matches
 * and the position of the keyword.
 *
 * @param {object} paper The paper containing title and keyword.
 * @returns {object} result with the matches and position.
 */
function isElement(value) {
  return !!value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value);
}

module.exports = isElement;

},{"./isObjectLike":310,"./isPlainObject":311}],304:[function(require,module,exports){
var getTag = require('./_getTag'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isArrayLike = require('./isArrayLike'),
    isBuffer = require('./isBuffer'),
    isFunction = require('./isFunction'),
    isObjectLike = require('./isObjectLike'),
    isString = require('./isString'),
    keys = require('./keys');

module.exports = function( paper ) {
	var title = paper.getTitle();
	var keyword = paper.getKeyword();
	var locale = paper.getLocale();
	var result = { matches: 0, position: -1 };
	result.matches = wordMatch( title, keyword, locale );
	result.position = title.toLocaleLowerCase().indexOf( keyword );

	return result;
};

},{"../stringProcessing/matchTextWithWord.js":346}],294:[function(require,module,exports){
var transitionWords = require( "../config/transitionWords.js" );
var twoPartTransitionWords = require( "../config/twoPartTransitionWords.js" );
var createRegexFromDoubleArray = require( "../stringProcessing/createRegexFromDoubleArray.js" );
var getSentences = require( "../stringProcessing/getSentences.js" );
var createRegexFromArray = require( "../stringProcessing/createRegexFromArray.js" );
var forEach = require( "lodash/forEach" );

/**
 * Matches the sentence against two part transition words.
 * @param {string} sentence The sentence to match against.
 * @returns {Array} The found transitional words.
 */
var matchTwoPartTransitionWords = function( sentence ) {
	return sentence.match( createRegexFromDoubleArray( twoPartTransitionWords() ) );
};

/**
 * Matches the sentence against transition words.
 * @param {string} sentence The sentence to match against.
 * @returns {Array} The found transitional words.
 */
var matchTransitionWords = function( sentence ) {
	return sentence.match( createRegexFromArray( transitionWords() ) );
};

/**
 * Checks the passed sentences to see if they contain transitional words.
 * @param {Array} sentences The sentences to match against.
 * @returns {Array} Array of sentence objects containing the complete sentence and the transitional words.
 */
var checkSentencesForTransitionWords = function( sentences ) {
	var results = [];

	forEach( sentences, function( sentence ) {
		var twoPartMatches = matchTwoPartTransitionWords( sentence );

},{"./_getTag":232,"./isArguments":298,"./isArray":299,"./isArrayLike":300,"./isBuffer":302,"./isFunction":305,"./isObjectLike":310,"./isString":312,"./keys":316}],305:[function(require,module,exports){
var isObject = require('./isObject');

			return;
		}
	} );

	return results;
};

/**
 * Checks how many sentences from a text contain at least one transition word or two-part transition word
 * that are defined in the transition words config and two part transition words config.
 * @param {Paper} paper The Paper object to get text from.
 * @returns {object} An object with the total number of sentences in the text
 * and the total number of sentences containing one or more transition words.
 */
module.exports = function( paper ) {
	var sentences = getSentences( paper.getText() );
	var sentenceResults = checkSentencesForTransitionWords( sentences );

	return {
		totalSentences: sentences.length,
		sentenceResults: sentenceResults,
		transitionWordSentences: sentenceResults.length
	};
};

},{"../config/transitionWords.js":269,"../config/twoPartTransitionWords.js":271,"../stringProcessing/createRegexFromArray.js":332,"../stringProcessing/createRegexFromDoubleArray.js":333,"../stringProcessing/getSentences.js":338,"lodash/forEach":176}],295:[function(require,module,exports){
/** @module analyses/getKeywordDensity */

var countWords = require( "../stringProcessing/countWords.js" );
var matchWords = require( "../stringProcessing/matchTextWithWord.js" );

/**
 * Calculates the keyword density .
 *
 * @param {object} paper The paper containing keyword and text.
  * @returns {number} The keyword density.
 */
module.exports = function( paper ) {
	var keyword = paper.getKeyword();
	var text = paper.getText();
	var locale = paper.getLocale();
	var wordCount = countWords( text );
	if ( wordCount === 0 ) {
		return 0;
	}
	var keywordCount = matchWords( text, keyword, locale );
	return ( keywordCount / wordCount ) * 100;
};

},{"../stringProcessing/countWords.js":331,"../stringProcessing/matchTextWithWord.js":346}],296:[function(require,module,exports){
/** @module analyses/getLinkStatistics */

},{"./isObject":309}],306:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks whether or not an anchor contains the passed keyword.
 * @param {string} keyword The keyword to look for.
 * @param {string} anchor The anchor to check against.
 * @param {string} locale The locale used for transliteration.
 * @returns {boolean} Whether or not the keyword was found.
 */
var keywordInAnchor = function( keyword, anchor, locale ) {
	if ( keyword === "" ) {
		return false;
	}

},{}],307:[function(require,module,exports){
var isNumber = require('./isNumber');

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
var countLinkTypes = function( paper ) {
	var url = paper.getUrl();
	var keyword = paper.getKeyword();
	var locale = paper.getLocale();
	var anchors = getLinks( paper.getText() );

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

},{"./isNumber":308}],308:[function(require,module,exports){
var isObjectLike = require('./isObjectLike');

		if ( keywordInAnchor( keyword, currentAnchor, locale ) ) {

			linkCount.keyword.totalKeyword++;
			linkCount.keyword.matchedAnchors.push( currentAnchor );
		}

		var linkType = getLinkType( currentAnchor, url );
		var linkFollow = checkNofollow( currentAnchor );

		linkCount[ linkType + "Total" ]++;
		linkCount[ linkType + linkFollow ]++;
	}

	return linkCount;
};

/**
 * Checks a text for anchors and returns an object with all linktypes found.
 *
 * @param {Paper} paper The paper object containing text, keyword and url.
 * @returns {Object} The object containing all linktypes.
 */
module.exports = function( paper ) {
	return countLinkTypes( paper );
};

},{"../stringProcessing/checkNofollow.js":327,"../stringProcessing/findKeywordInUrl.js":334,"../stringProcessing/getLinkType.js":337,"./getLinks.js":297}],297:[function(require,module,exports){
/** @module analyses/getLinkStatistics */

var getAnchors = require( "../stringProcessing/getAnchorsFromText.js" );

},{"./isObjectLike":310}],309:[function(require,module,exports){
/**
 * Checks a text for anchors and returns the number found.
 *
 * @param {Object} text The text
 * @returns {Array} An array with the anchors
 */
module.exports = function( text ) {
	return getAnchors( text );
};

},{"../stringProcessing/getAnchorsFromText.js":336}],298:[function(require,module,exports){
var countWords = require( "../stringProcessing/countWords.js" );
var matchParagraphs = require( "../stringProcessing/matchParagraphs.js" );
var filter = require( "lodash/filter" );

},{}],310:[function(require,module,exports){
/**
 * Calculates the keyword density .
 *
 * @param {object} paper The paper containing keyword and text.
 * @returns {number} The keyword density.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var paragraphs = matchParagraphs( text );
	var paragraphsLength = [];
	paragraphs.map( function ( paragraph ) {
		paragraphsLength.push( {
			wordCount: countWords( paragraph ),
			paragraph: paragraph
		} );
	} );

	return filter( paragraphsLength, function ( paragraphLength ) {
		return ( paragraphLength.wordCount > 0 );
	} );
};

},{}],311:[function(require,module,exports){
var getPrototype = require('./_getPrototype'),
    isHostObject = require('./_isHostObject'),
    isObjectLike = require('./isObjectLike');

var nonverbEndingEd = require( "./passivevoice-english/non-verb-ending-ed.js" )();
var determiners = require( "./passivevoice-english/determiners.js" )();

var auxiliaries = require( "./passivevoice-english/auxiliaries.js" )();
var irregulars = require( "./passivevoice-english/irregulars.js" )();
var stopwords = require( "./passivevoice-english/stopwords.js" )();

var filter = require( "lodash/filter" );
var isUndefined = require( "lodash/isUndefined" );
var forEach = require( "lodash/forEach" );

/**
 * Matches string with an array, returns the word and the index it was found on
 * @param {string} sentence The sentence to match the strings from the array to.
 * @param {Array} matchArray The array with strings to match
 * @returns {Array} The array with matches, containing the index of the match and the matched string.
 * Returns an empty array if none are found.
 */
var matchArray = function( sentence, matchArray ) {
	var matches = matchArray;
	var matchedParts = [];
	forEach( matches, function( part ) {
		part = stripSpaces( part );

		// Search for each part in the array and filter on index -1
		var index = sentence.search( stringToRegex( part ) );
		if ( index > -1 ) {
			matchedParts.push( { index: index, match: part } );
		}
	} );
	return matchedParts;
};

/**
 * Sorts the array on the index property of each entry.
 * @param {Array} indices The array with indices.
 * @returns {Array} The sorted array with indices.
 */
var sortIndices = function( indices ) {
	return indices.sort( function( a, b ) {
		return ( a.index > b.index );
	} );
};

/**
 * Filters duplicate entries if the indices overlap.
 * @param {Array} indices The array with indices to be filtered
 * @returns {Array} The filtered array
 */
var filterIndices = function( indices ) {
	indices = sortIndices( indices );
	for ( var i = 0; i < indices.length; i++ ) {

		// If the next index is within the range of the current index and the length of the word, remove it
		// This makes sure we don't match combinations twice, like "even though" and "though".
		if ( !isUndefined( indices[ i + 1 ] ) && indices[ i + 1 ].index < indices[ i ].index + indices[ i ].match.length ) {
			indices.pop( i + 1 );
		}
	}
	return indices;
};

},{"./_getPrototype":230,"./_isHostObject":246,"./isObjectLike":310}],312:[function(require,module,exports){
var isArray = require('./isArray'),
    isObjectLike = require('./isObjectLike');

	// Matches the sentences with words ending in ing
	var matches = sentence.match( /\w+ing($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig ) || [];

	var exclusionArray = [ "king", "cling", "ring", "being" ];

	// Filters out words ending in -ing that aren't verbs.
	return filter( matches, function( match ) {
		return matchArray( stripSpaces( match ), exclusionArray ).length === 0;
	} );
};

/**
 * Gets the indexes of sentence breakers (auxiliaries, stopwords and active verbs) to determine subsentences.
 * Stopwords are filtered because they can contain duplicate matches, like "even though" and "though".
 * @param {string} sentence The sentence to check for indices of auxiliaries, stopwords and active verbs
 * @returns {Array} The array with valid indices to use for determining subsentences.
 */
var getSentenceBreakers = function( sentence ) {
	var auxiliaryIndices = matchArray( sentence, auxiliaries );

	var stopwordIndices = matchArray( sentence, stopwords );
	stopwordIndices = filterIndices( stopwordIndices );

	var ingVerbs = getVerbsEndingInIng( sentence );
	var ingVerbsIndices = matchArray( sentence, ingVerbs );

	// Concat all indices arrays and sort them.
	var indices = [].concat( auxiliaryIndices, stopwordIndices, ingVerbsIndices );
	return sortIndices( indices );
};

/**
 * Gets the subsentences from a sentence by determining sentence breakers
 * @param {string} sentence The sentence to split up in subsentences
 * @returns {Array} The array with all subsentences of a sentence that have an auxiliary
 */
var getSubsentences = function( sentence ) {
	var auxiliaryRegex = arrayToRegex( auxiliaries );
	var subSentences = [];

	// First check if there is an auxiliary word in the sentence
	if( sentence.match( auxiliaryRegex ) !== null ) {
		var indices = getSentenceBreakers( sentence );

},{"./isArray":299,"./isObjectLike":310}],313:[function(require,module,exports){
var isObjectLike = require('./isObjectLike');

			// Cut the sentence from the current index to the endIndex (start of next breaker, of end of sentence).
			var subSentence = stripSpaces( sentence.substr( indices[ i ].index, endIndex - indices[ i ].index ) );
			subSentences.push( subSentence );
		}
	}

	// If a subsentence doesn't have an auxiliary, we don't need it, so it can be filtered out.
	subSentences = filter( subSentences, function( subSentence ) {
		return subSentence.match( auxiliaryRegex ) !== null;
	} );

	return subSentences;
};

/**
 * Gets regular passive verbs.
 * @param {string} subSentence The sub sentence to check for passive verbs.
 * @returns {Array} The array with all matched verbs.
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

module.exports = isSymbol;

},{"./isObjectLike":310}],314:[function(require,module,exports){
var isLength = require('./isLength'),
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

	// Matches the sentences with words ending in ed
	var matches = subSentence.match( /\w+ed($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig ) || [];

	// Filters out words ending in -ed that aren't verbs.
	return filter( matches, function( match ) {

		// Strips spaces from the match
		return matchArray( stripSpaces( match ), nonverbEndingEd ).length === 0;
	} );
};

/**
 * Gets irregular passive verbs
 * @param {string} subSentence The sub sentence to check for passive verbs.
 * @returns {Array} The array with all matched verbs.
 */
var getIrregularVerbs = function( subSentence ) {
	var irregularVerbs = matchArray( subSentence, irregulars );
	return filter( irregularVerbs, function( verb ) {
		// If rid is used with get, gets, getting, got or gotten, remove it.
		if ( verb.match === "rid" ) {
			var exclusionArray = [ "get", "gets", "getting", "got", "gotten" ];
			if ( matchArray( subSentence, exclusionArray ).length > 0 ) {
				return false;
			}
		}
		return true;
	} );
};

/**
 * Matches having with a verb directly following it. If so, it is not passive.
 * @param {string} subSentence The subsentence to check for the word 'having' and a verb
 * @param {Array} verbs The array with verbs to check.
 * @returns {boolean} True if it is an exception, false if it is not.
 */
var isHavingException = function( subSentence, verbs ) {

	// Match having with a verb directly following it. If so it is active.
	var indexOfHaving = subSentence.indexOf( "having" );
	if ( indexOfHaving > -1 ) {
		var verbIndices = matchArray( subSentence, verbs );

		if ( !isUndefined( verbIndices[ 0 ] ) && !isUndefined( verbIndices[ 0 ].index ) ) {
			// 7 is the number of characters of the word 'having' including space.
			return verbIndices[ 0 ].index  <= subSentence.indexOf( "having" ) + 7;
		}
	}
	return false;
};

},{"./isLength":306,"./isObjectLike":310}],315:[function(require,module,exports){
/**
 * Match the left. If left is preceeded by `a` or `the`, it isn't a verb.
 * @param {string} subSentence The subsentence to check for the word 'having' and a verb
 * @param {Array} verbs The array with verbs to check.
 * @returns {boolean} True if it is an exception, false if it is not.
 */
var isLeftException = function ( subSentence, verbs ) {

},{}],316:[function(require,module,exports){
var baseHas = require('./_baseHas'),
    baseKeys = require('./_baseKeys'),
    indexKeys = require('./_indexKeys'),
    isArrayLike = require('./isArrayLike'),
    isIndex = require('./_isIndex'),
    isPrototype = require('./_isPrototype');

/**
 * If the word 'fit' is preceeded by a determiner, it shouldn't be marked as active.
 * @param {string} subSentence The subsentence to check for the word 'having' and a verb
 * @returns {boolean} True if it is an exception, false if it is not.
 */
var isFitException = function( subSentence ) {
	var indexOfFit = subSentence.indexOf( "fit" );
	if ( indexOfFit > -1 ) {
		var subString = subSentence.substr( 0, indexOfFit );
		var determinerIndices = matchArray( subString, determiners );
		return determinerIndices.length > 1;
	}
	return false;
};

/**
 * Gets the exceptions. Some combinations shouldn't be marked as passive, so we need to filter them out.
 * @param {string} subSentence The subsentence to check for exceptions.
 * @param {array} verbs The array of verbs, used to determine exceptions.
 * @returns {boolean} Wether there is an exception or not.
 */
var getExceptions = function( subSentence, verbs ) {
	var havingException = isHavingException( subSentence, verbs );
	var leftException = isLeftException( subSentence, verbs );
	var fitException = isFitException( subSentence );

	// If any of the exceptions is true, return true.
	return havingException || leftException || fitException;
};

},{"./_baseHas":178,"./_baseKeys":187,"./_indexKeys":240,"./_isIndex":247,"./_isPrototype":252,"./isArrayLike":300}],317:[function(require,module,exports){
var baseKeysIn = require('./_baseKeysIn'),
    indexKeys = require('./_indexKeys'),
    isIndex = require('./_isIndex'),
    isPrototype = require('./_isPrototype');

	// Checks for exceptions in the found verbs.
	var exceptions = getExceptions( subSentence, verbs );

	// If there is any exception, this subsentence cannot be passive.
	return verbs.length > 0 && exceptions === false;
};

/**
 * Determines the number of passive sentences in the text.
 * @param {Paper} paper The paper object to get the text from.
 * @returns {object} The number of passives found in the text and the passive sentences.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var sentences = getSentences( text );
	var passiveSentences = [];

	// Get subsentences for each sentence.
	forEach( sentences, function( sentence ) {
		var subSentences = getSubsentences( sentence );
		var passive = false;
		forEach( subSentences, function( subSentence ) {
			passive = determinePassives( subSentence );
		} );
		if ( passive === true ) {
			passiveSentences.push( sentence );
			passive = false;
		}
	} );

	return {
		total: sentences.length,
		passives: passiveSentences
	};
};

},{"./_baseKeysIn":188,"./_indexKeys":240,"./_isIndex":247,"./_isPrototype":252}],318:[function(require,module,exports){
var arrayMap = require('./_arrayMap'),
    baseIteratee = require('./_baseIteratee'),
    baseMap = require('./_baseMap'),
    isArray = require('./isArray');

/**
 * Compares the first word of each sentence with the first word of the following sentence.
 * @param {array} sentenceBeginnings The array containing the first word of each sentence.
 * @param {number} i The iterator for the sentenceBeginning array.
 * @returns {boolean} Returns true if sentence beginnings match.
 */
var matchSentenceBeginnings = function( sentenceBeginnings, i ) {
	if ( sentenceBeginnings[ i ] === sentenceBeginnings[ i + 1 ] ) {
		return true;
	}
	return false;
};

/**
 * Counts the number of similar sentence beginnings.
 * @param {array} sentenceBeginnings The array containing the first word of each sentence.
 * @returns {array} The array containing the objects containing the first words and the corresponding counts.
 */
var compareFirstWords = function ( sentenceBeginnings ) {
	var counts = [];
	var count = 1;
	for ( var i = 0; i < sentenceBeginnings.length; i++ ) {
		if ( matchSentenceBeginnings( sentenceBeginnings, i ) ) {
			count++;
		} else {
			counts.push( { word: sentenceBeginnings[ i ], count: count } );
			count = 1;
		}
	}
	return counts;
};

},{"./_arrayMap":158,"./_baseIteratee":186,"./_baseMap":189,"./isArray":299}],319:[function(require,module,exports){
var MapCache = require('./_MapCache');

},{"../language/en/firstWordExceptions.js":281,"../stringProcessing/getSentences.js":338,"../stringProcessing/getWords.js":341,"../stringProcessing/removeNonWordCharacters.js":347,"../stringProcessing/stripSpaces.js":356}],301:[function(require,module,exports){
var getSubheadingContents = require( "../stringProcessing/getSubheadings.js" ).getSubheadingContents;
var stripTags = require( "../stringProcessing/stripHTMLTags.js" );
var forEach = require( "lodash/forEach" );

/**
 * Gets the subheadings from the text and returns the length of these subheading in an array.
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {Array} The array with the length of each subheading.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var matches = getSubheadingContents( text );

	var subHeadings = [];
	forEach( matches, function( subHeading ) {
		subHeading = stripTags( subHeading ).length;
		if ( subHeading > 0 ) {
			subHeadings.push( subHeading );
		}
	} );

	return subHeadings;
};

},{"../stringProcessing/getSubheadings.js":340,"../stringProcessing/stripHTMLTags.js":353,"lodash/forEach":176}],302:[function(require,module,exports){
var getSubheadingsContents = require( "../stringProcessing/getSubheadings.js" ).getSubheadingContents;

/**
 * Checks if there is a subheading present in the text
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {number} Number of headings found.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var headings = getSubheadingsContents( text ) || [];
	return headings.length;
};

},{"./_MapCache":142}],320:[function(require,module,exports){
var baseMerge = require('./_baseMerge'),
    createAssigner = require('./_createAssigner');

/**
 * Gets the subheadings from the text and returns the length of these subheading in an array.
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {Array} The array with the length of each subheading.
 */
module.exports = function( paper ) {
	var text = paper.getText();

	var matches = getSubheadingTexts( text );

	var subHeadingTexts = [];
	forEach( matches, function( subHeading ) {

		subHeadingTexts.push( countWords( subHeading ) );
	} );
	return subHeadingTexts;
};

},{"./_baseMerge":192,"./_createAssigner":218}],321:[function(require,module,exports){
var baseMerge = require('./_baseMerge'),
    createAssigner = require('./_createAssigner');

/**
 * Calculates the complexity of words in a text, returns each words with their complexity.
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {Object} The words found in the text with the number of syllables.
 */
module.exports = function( paper ) {
	var words = getWords( paper.getText() );
	var wordComplexity = [];
	words.map( function( word ) {
		wordComplexity.push( { word: word, complexity: countSyllables( word ) } );
	} );
	return wordComplexity;
};


},{"./_baseMerge":192,"./_createAssigner":218}],322:[function(require,module,exports){
/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Matches the alt-tags in the images found in the text.
 * Returns an object with the totals and different alt-tags.
 *
 * @param {Array} imageMatches Array with all the matched images in the text
 * @param {string} keyword the keyword to check for.
 * @param {string} locale The locale used for transliteration.
 * @returns {object} altProperties Object with all alt-tags that were found.
 */
var matchAltProperties = function( imageMatches, keyword, locale ) {
	var altProperties = {
		noAlt: 0,
		withAlt: 0,
		withAltKeyword: 0,
		withAltNonKeyword: 0
	};

	for ( var i = 0; i < imageMatches.length; i++ ) {
		var alttag = imageAlttag( imageMatches[ i ] );

		// If no alt-tag is set
		if ( alttag === "" ) {
			altProperties.noAlt++;
			continue;
		}

		// If no keyword is set, but the alt-tag is
		if ( keyword === "" && alttag !== "" ) {
			altProperties.withAlt++;
			continue;
		}

		if ( wordMatch( alttag, keyword, locale ) === 0 && alttag !== "" ) {

			// Match for keywords?
			altProperties.withAltNonKeyword++;
			continue;
		}

		if ( wordMatch( alttag, keyword, locale ) > 0 ) {
			altProperties.withAltKeyword++;
			continue;
		}
	}

	return altProperties;
};

},{}],323:[function(require,module,exports){
/**
 * Checks the text for images, checks the type of each image and alttags for containing keywords
 *
 * @param {Paper} paper The paper to check for images
 * @returns {object} Object containing all types of found images
 */
module.exports = function( paper ) {
	return matchAltProperties( imageInText( paper.getText() ), paper.getKeyword(), paper.getLocale() );
};

},{"../stringProcessing/getAlttagContent":335,"../stringProcessing/imageInText":342,"../stringProcessing/matchTextWithWord":346}],306:[function(require,module,exports){
/** @module researches/imageInText */

var imageInText = require( "./../stringProcessing/imageInText" );

},{}],324:[function(require,module,exports){
/**
 * Checks the amount of images in the text.
 *
 * @param {Paper} paper The paper to check for images
 * @returns {number} The amount of found images
 */
module.exports = function( paper ) {
	return imageInText( paper.getText() ).length;
};

},{}],325:[function(require,module,exports){
var baseProperty = require('./_baseProperty'),
    basePropertyDeep = require('./_basePropertyDeep'),
    isKey = require('./_isKey'),
    toKey = require('./_toKey');

/**
 * Determines the length in words of a the keyphrase, the keyword is a keyphrase if it is more than one word.
 *
 * @param {Paper} paper The paper to research
 * @returns {number} The length of the keyphrase
 */
function keyphraseLengthResearch( paper ) {
	var keyphrase = sanitizeString( paper.getKeyword() );

	return countWords( keyphrase );
}

module.exports = keyphraseLengthResearch;

},{"./_baseProperty":194,"./_basePropertyDeep":195,"./_isKey":249,"./_toKey":279}],326:[function(require,module,exports){
var arrayReduce = require('./_arrayReduce'),
    baseEach = require('./_baseEach'),
    baseIteratee = require('./_baseIteratee'),
    baseReduce = require('./_baseReduce'),
    isArray = require('./isArray');

var wordMatch = require( "../stringProcessing/matchTextWithWord.js" );
/**
 * Matches the keyword in the URL. Replaces whitespaces with dashes and uses dash as wordboundary.
 *
 * @param {Paper} paper the Paper object to use in this count.
 * @returns {int} Number of times the keyword is found.
 */
module.exports = function( paper ) {
	var keyword = paper.getKeyword().replace( "'", "" ).replace( /\s/ig, "-" );

	return wordMatch( paper.getUrl(), keyword, paper.getLocale() );
};

},{"../stringProcessing/matchTextWithWord.js":346}],309:[function(require,module,exports){
/* @module analyses/matchKeywordInSubheadings */

},{"./_arrayReduce":160,"./_baseEach":170,"./_baseIteratee":186,"./_baseReduce":196,"./isArray":299}],327:[function(require,module,exports){
var apply = require('./_apply'),
    toInteger = require('./toInteger');

/**
 * Checks if there are any subheadings like h2 in the text
 * and if they have the keyword in them.
 *
 * @param {object} paper The paper object containing the text and keyword.
 * @returns {object} the result object.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var keyword = paper.getKeyword();
	var locale = paper.getLocale();
	var result = { count: 0 };
	text = stripSomeTags( text );
	var matches = getSubheadingContents( text );

	if ( 0 !== matches.length ) {
		result.count = matches.length;
		result.matches = subheadingMatch( matches, keyword, locale );
	}

	return result;
};


},{"../stringProcessing/getSubheadings.js":340,"../stringProcessing/stripNonTextTags.js":354,"../stringProcessing/subheadingsMatch.js":357}],310:[function(require,module,exports){
var matchTextWithWord = require( "../stringProcessing/matchTextWithWord.js" );

/**
 * Matches the keyword in the description if a description and keyword are available.
 * default is -1 if no description and/or keyword is specified
 *
 * @param {Paper} paper The paper object containing the description.
 * @returns {number} The number of matches with the keyword
 */
module.exports = function( paper ) {
	if ( paper.getDescription() === "" ) {
		return -1;
	}
	return matchTextWithWord( paper.getDescription(), paper.getKeyword(), paper.getLocale() );
};


},{"../stringProcessing/matchTextWithWord.js":346}],311:[function(require,module,exports){
/**
 * Check the length of the description.
 * @param {Paper} paper The paper object containing the description.
 * @returns {number} The length of the description.
 */
module.exports = function( paper ) {
	return paper.getDescription().length;
};

},{}],312:[function(require,module,exports){
/**
 * Check the length of the title.
 * @param {Paper} paper The paper object containing the title.
 * @returns {number} The length of the title.
 */
module.exports = function( paper ) {
	return paper.getTitle().length;
};

},{}],313:[function(require,module,exports){
module.exports = function() {
	return [
		"am",
		"is",
		"are",
		"was",
		"were",
		"been",
		"being",
		"get",
		"gets",
		"getting",
		"got",
		"gotten",
		"having",
		"be",
		"she's",
		"he's",
		"it's",
		"i'm",
		"we're",
		"they're",
		"you're",
		"what's",
		"isn't",
		"weren't",
		"wasn't",
		"that's",
		"aren't"
	];
};

},{}],314:[function(require,module,exports){
module.exports = function() {
	return [
		"a",
		"an",
		"the",
		"my",
		"her",
		"his",
		"their",
		"its",
		"our",
		"your",
		"am",
		"is",
		"are",
		"was",
		"were",
		"been",
		"being",
		"get",
		"gets",
		"getting",
		"got",
		"gotten",
		"having",
		"be",
		"she's",
		"he's",
		"it's",
		"i'm",
		"we're",
		"they're",
		"you're",
		"what's",
		"isn't",
		"weren't",
		"wasn't",
		"that's",
		"aren't"
	];
};


},{}],315:[function(require,module,exports){
module.exports = function() {
	return [
		"arisen",
		"awoken",
		"reawoken",
		"babysat",
		"backslid",
		"backslidden",
		"beat",
		"beaten",
		"become",
		"begun",
		"bent",
		"unbent",
		"bet",
		"bid",
		"outbid",
		"rebid",
		"underbid",
		"overbid",
		"bidden",
		"bitten",
		"blown",
		"bought",
		"overbought",
		"bound",
		"unbound",
		"rebound",
		"broadcast",
		"rebroadcast",
		"broken",
		"brought",
		"browbeat",
		"browbeaten",
		"built",
		"prebuilt",
		"rebuilt",
		"overbuilt",
		"burnt",
		"burst",
		"bust",
		"cast",
		"miscast",
		"recast",
		"caught",
		"chosen",
		"clung",
		"come",
		"overcome",
		"cost",
		"crept",
		"cut",
		"undercut",
		"recut",
		"daydreamt",
		"dealt",
		"misdealt",
		"redealt",
		"disproven",
		"done",
		"predone",
		"outdone",
		"misdone",
		"redone",
		"overdone",
		"undone",
		"drawn",
		"outdrawn",
		"redrawn",
		"overdrawn",
		"dreamt",
		"driven",
		"outdriven",
		"drunk",
		"outdrunk",
		"overdrunk",
		"dug",
		"dwelt",
		"eaten",
		"overeaten",
		"fallen",
		"felt",
		"fit",
		"refit",
		"retrofit",
		"flown",
		"outflown",
		"flung",
		"forbidden",
		"forecast",
		"foregone",
		"foreseen",
		"foretold",
		"forgiven",
		"forgotten",
		"forsaken",
		"fought",
		"outfought",
		"found",
		"frostbitten",
		"frozen",
		"unfrozen",
		"given",
		"gone",
		"undergone",
		"got",
		"gotten",
		"ground",
		"reground",
		"grown",
		"outgrown",
		"regrown",
		"had",
		"handwritten",
		"heard",
		"reheard",
		"misheard",
		"overheard",
		"held",
		"hewn",
		"hidden",
		"unhidden",
		"hit",
		"hung",
		"rehung",
		"overhung",
		"unhung",
		"hurt",
		"inlaid",
		"input",
		"interwound",
		"interwoven",
		"jerry-built",
		"kept",
		"knelt",
		"knit",
		"reknit",
		"unknit",
		"known",
		"laid",
		"mislaid",
		"relaid",
		"overlaid",
		"lain",
		"underlain",
		"leant",
		"leapt",
		"outleapt",
		"learnt",
		"unlearnt",
		"relearnt",
		"mislearnt",
		"left",
		"lent",
		"let",
		"lip-read",
		"lit",
		"relit",
		"lost",
		"made",
		"premade",
		"remade",
		"meant",
		"met",
		"mown",
		"offset",
		"paid",
		"prepaid",
		"repaid",
		"overpaid",
		"partaken",
		"proofread",
		"proven",
		"put",
		"quick-frozen",
		"quit",
		"read",
		"misread",
		"reread",
		"retread",
		"rewaken",
		"rid",
		"ridden",
		"outridden",
		"overridden",
		"risen",
		"roughcast",
		"run",
		"outrun",
		"rerun",
		"overrun",
		"rung",
		"said",
		"sand-cast",
		"sat",
		"outsat",
		"sawn",
		"seen",
		"overseen",
		"sent",
		"resent",
		"set",
		"preset",
		"reset",
		"misset",
		"sewn",
		"resewn",
		"oversewn",
		"unsewn",
		"shaken",
		"shat",
		"shaven",
		"shit",
		"shone",
		"outshone",
		"shorn",
		"shot",
		"outshot",
		"overshot",
		"shown",
		"shrunk",
		"preshrunk",
		"shut",
		"sight-read",
		"slain",
		"slept",
		"outslept",
		"overslept",
		"slid",
		"slit",
		"slung",
		"unslung",
		"slunk",
		"smelt",
		"outsmelt",
		"snuck",
		"sold",
		"undersold",
		"presold",
		"outsold",
		"resold",
		"oversold",
		"sought",
		"sown",
		"spat",
		"spelt",
		"misspelt",
		"spent",
		"underspent",
		"outspent",
		"misspent",
		"overspent",
		"spilt",
		"overspilt",
		"spit",
		"split",
		"spoilt",
		"spoken",
		"outspoken",
		"misspoken",
		"overspoken",
		"spread",
		"sprung",
		"spun",
		"unspun",
		"stolen",
		"stood",
		"understood",
		"misunderstood",
		"strewn",
		"stricken",
		"stridden",
		"striven",
		"struck",
		"strung",
		"unstrung",
		"stuck",
		"unstuck",
		"stung",
		"stunk",
		"sublet",
		"sunburnt",
		"sung",
		"outsung",
		"sunk",
		"sweat",
		"swept",
		"swollen",
		"sworn",
		"outsworn",
		"swum",
		"outswum",
		"swung",
		"taken",
		"undertaken",
		"mistaken",
		"retaken",
		"overtaken",
		"taught",
		"mistaught",
		"retaught",
		"telecast",
		"test-driven",
		"test-flown",
		"thought",
		"outthought",
		"rethought",
		"overthought",
		"thrown",
		"outthrown",
		"overthrown",
		"thrust",
		"told",
		"retold",
		"torn",
		"retorn",
		"trod",
		"trodden",
		"typecast",
		"typeset",
		"upheld",
		"upset",
		"waylaid",
		"wept",
		"wet",
		"rewet",
		"withdrawn",
		"withheld",
		"withstood",
		"woken",
		"won",
		"rewon",
		"worn",
		"reworn",
		"wound",
		"rewound",
		"overwound",
		"unwound",
		"woven",
		"rewoven",
		"unwoven",
		"written",
		"typewritten",
		"underwritten",
		"outwritten",
		"miswritten",
		"rewritten",
		"overwritten",
		"wrung"
	];
};

},{}],316:[function(require,module,exports){
module.exports = function() {
	return [
		"ablebodied",
		"abovementioned",
		"absentminded",
		"accoladed",
		"accompanied",
		"acculturized",
		"accursed",
		"acerated",
		"acerbated",
		"acetylized",
		"achromatised",
		"achromatized",
		"acidified",
		"acned",
		"actualised",
		"adrenalised",
		"adulated",
		"adversed",
		"aestheticised",
		"affectioned",
		"affined",
		"affricated",
		"aforementioned",
		"agerelated",
		"aggrieved",
		"airbed",
		"aircooled",
		"airspeed",
		"alcoholized",
		"alcoved",
		"alkalised",
		"allianced",
		"aluminized",
		"alveolated",
		"ambered",
		"ammonified",
		"amplified",
		"anagrammatised",
		"anagrammatized",
		"anathematised",
		"aniseed",
		"ankled",
		"annualized",
		"anonymised",
		"anthologized",
		"antlered",
		"anucleated",
		"anviled",
		"anvilshaped",
		"apostrophised",
		"apostrophized",
		"appliqued",
		"apprized",
		"arbitrated",
		"armored",
		"articled",
		"ashamed",
		"assented",
		"atomised",
		"atrophied",
		"auricled",
		"auriculated",
		"aurified",
		"autopsied",
		"axled",
		"babied",
		"backhoed",
		"badmannered",
		"badtempered",
		"balustered",
		"baned",
		"barcoded",
		"bareboned",
		"barefooted",
		"barelegged",
		"barnacled",
		"bayoneted",
		"beadyeyed",
		"beaked",
		"beaned",
		"beatified",
		"beautified",
		"beavered",
		"bed",
		"bedamned",
		"bedecked",
		"behoved",
		"belated",
		"bellbottomed",
		"bellshaped",
		"benighted",
		"bequeathed",
		"berried",
		"bespectacled",
		"bewhiskered",
		"bighearted",
		"bigmouthed",
		"bigoted",
		"bindweed",
		"binucleated",
		"biopsied",
		"bioturbed",
		"biped",
		"bipinnated",
		"birdfeed",
		"birdseed",
		"bisegmented",
		"bitterhearted",
		"blabbermouthed",
		"blackhearted",
		"bladed",
		"blankminded",
		"blearyeyed",
		"bleed",
		"blissed",
		"blobbed",
		"blondhaired",
		"bloodied",
		"bloodred",
		"bloodshed",
		"blueblooded",
		"boatshaped",
		"bobsled",
		"bodied",
		"boldhearted",
		"boogied",
		"boosed",
		"bosomed",
		"bottlefed",
		"bottlefeed",
		"bottlenecked",
		"bouldered",
		"bowlegged",
		"bowlshaped",
		"brandied",
		"bravehearted",
		"breastfed",
		"breastfeed",
		"breed",
		"brighteyed",
		"brindled",
		"broadhearted",
		"broadleaved",
		"broadminded",
		"brokenhearted",
		"broomed",
		"broomweed",
		"buccaned",
		"buckskinned",
		"bucktoothed",
		"buddied",
		"buffaloed",
		"bugeyed",
		"bugleweed",
		"bugweed",
		"bulletined",
		"bunked",
		"busied",
		"butterfingered",
		"cabbed",
		"caddied",
		"cairned",
		"calcified",
		"canalized",
		"candied",
		"cannulated",
		"canoed",
		"canopied",
		"canvased",
		"caped",
		"capsulated",
		"cassocked",
		"castellated",
		"catabolised",
		"catheterised",
		"caudated",
		"cellmediated",
		"cellulosed",
		"certified",
		"chagrined",
		"chambered",
		"chested",
		"chevroned",
		"chickenfeed",
		"chickenhearted",
		"chickweed",
		"chilblained",
		"childbed",
		"chinned",
		"chromatographed",
		"ciliated",
		"cindered",
		"cingulated",
		"circumstanced",
		"cisgendered",
		"citrullinated",
		"clappered",
		"clarified",
		"classified",
		"clawshaped",
		"claysized",
		"cleanhearted",
		"clearminded",
		"clearsighted",
		"cliched",
		"clodded",
		"cloistered",
		"closefisted",
		"closehearted",
		"closelipped",
		"closemouthed",
		"closeted",
		"cloudseed",
		"clubfooted",
		"clubshaped",
		"clued",
		"cockeyed",
		"codified",
		"coed",
		"coevolved",
		"coffined",
		"coiffed",
		"coinfected",
		"coldblooded",
		"coldhearted",
		"collateralised",
		"colonialised",
		"colorcoded",
		"colorised",
		"colourised",
		"columned",
		"commoditized",
		"compactified",
		"companioned",
		"complexioned",
		"conceited",
		"concerned",
		"concussed",
		"coneshaped",
		"congested",
		"contented",
		"convexed",
		"coralled",
		"corymbed",
		"cottonseed",
		"countrified",
		"countrybred",
		"courtmartialled",
		"coved",
		"coveralled",
		"cowshed",
		"cozied",
		"cragged",
		"crayoned",
		"credentialed",
		"creed",
		"crenulated",
		"crescentshaped",
		"cressweed",
		"crewed",
		"cricked",
		"crispated",
		"crossbarred",
		"crossbed",
		"crossbred",
		"crossbreed",
		"crossclassified",
		"crosseyed",
		"crossfertilised",
		"crossfertilized",
		"crossindexed",
		"crosslegged",
		"crossshaped",
		"crossstratified",
		"crossstriated",
		"crotched",
		"crucified",
		"cruelhearted",
		"crutched",
		"cubeshaped",
		"cubified",
		"cuckolded",
		"cucumbershaped",
		"cumbered",
		"cuminseed",
		"cupshaped",
		"curated",
		"curded",
		"curfewed",
		"curlicued",
		"curlycued",
		"curried",
		"curtsied",
		"cyclized",
		"cylindershaped",
		"damed",
		"dandified",
		"dangered",
		"darkhearted",
		"daybed",
		"daylighted",
		"deacidified",
		"deacylated",
		"deadhearted",
		"deadlined",
		"deaminized",
		"deathbed",
		"decalcified",
		"decertified",
		"deckbed",
		"declassified",
		"declutched",
		"decolourated",
		"decreed",
		"deed",
		"deeprooted",
		"deepseated",
		"defensed",
		"defied",
		"deflexed",
		"deglamorised",
		"degunkified",
		"dehumidified",
		"deified",
		"deled",
		"delegitimised",
		"demoded",
		"demystified",
		"denasalized",
		"denazified",
		"denied",
		"denitrified",
		"denticulated",
		"deseed",
		"desexualised",
		"desposited",
		"detoxified",
		"deuced",
		"devitrified",
		"dewlapped",
		"dezincified",
		"diagonalised",
		"dialogued",
		"died",
		"digitated",
		"dignified",
		"dilled",
		"dimwitted",
		"diphthonged",
		"disaffected",
		"disaggregated",
		"disarrayed",
		"discalced",
		"discolorated",
		"discolourated",
		"discshaped",
		"diseased",
		"disembodied",
		"disencumbered",
		"disfranchised",
		"diskshaped",
		"disproportionated",
		"disproportioned",
		"disqualified",
		"distempered",
		"districted",
		"diversified",
		"diverticulated",
		"divested",
		"divvied",
		"dizzied",
		"dogged",
		"dogsbodied",
		"dogsled",
		"domeshaped",
		"domiciled",
		"dormered",
		"doublebarrelled",
		"doublestranded",
		"doublewalled",
		"downhearted",
		"duckbilled",
		"eared",
		"echeloned",
		"eddied",
		"edified",
		"eggshaped",
		"elasticated",
		"electrified",
		"elegized",
		"embed",
		"embodied",
		"emceed",
		"empaneled",
		"empanelled",
		"emptyhearted",
		"emulsified",
		"engined",
		"ennobled",
		"envied",
		"enzymecatalysed",
		"enzymecatalyzed",
		"epitomised",
		"epoxidized",
		"epoxied",
		"etherised",
		"etherized",
		"evilhearted",
		"evilminded",
		"exceed",
		"exemplified",
		"exponentiated",
		"expurgated",
		"extravasated",
		"extraverted",
		"extroverted",
		"fabled",
		"facelifted",
		"facsimiled",
		"fainthearted",
		"falcated",
		"falsehearted",
		"falsified",
		"famed",
		"fancified",
		"fanged",
		"fanshaped",
		"fantasied",
		"farsighted",
		"fated",
		"fatted",
		"fazed",
		"featherbed",
		"fed",
		"federalized",
		"feeblehearted",
		"feebleminded",
		"feeblewitted",
		"feed",
		"fendered",
		"fenestrated",
		"ferried",
		"fevered",
		"fibered",
		"fibred",
		"ficklehearted",
		"fiercehearted",
		"figged",
		"filigreed",
		"filterfeed",
		"fireweed",
		"firmhearted",
		"fissured",
		"flanged",
		"flanneled",
		"flannelled",
		"flatbed",
		"flatfooted",
		"flatted",
		"flaxenhaired",
		"flaxseed",
		"flaxweed",
		"flighted",
		"floodgenerated",
		"flowerbed",
		"fluidised",
		"fluidized",
		"flurried",
		"fobbed",
		"fonded",
		"forcefeed",
		"foreshortened",
		"foresighted",
		"forkshaped",
		"formfeed",
		"fortified",
		"fortressed",
		"foulmouthed",
		"foureyed",
		"foxtailed",
		"fractionalised",
		"fractionalized",
		"frankhearted",
		"freed",
		"freehearted",
		"freespirited",
		"frenzied",
		"friezed",
		"frontiered",
		"fructified",
		"frumped",
		"fullblooded",
		"fullbodied",
		"fullfledged",
		"fullhearted",
		"funnelshaped",
		"furnaced",
		"gaitered",
		"galleried",
		"gangliated",
		"ganglionated",
		"gangrened",
		"gargoyled",
		"gasified",
		"gaunted",
		"gauntleted",
		"gauzed",
		"gavelled",
		"gelatinised",
		"gemmed",
		"genderized",
		"gentled",
		"gentlehearted",
		"gerrymandered",
		"gladhearted",
		"glamored",
		"globed",
		"gloried",
		"glorified",
		"glycosylated",
		"goateed",
		"gobletshaped",
		"godspeed",
		"goodhearted",
		"goodhumored",
		"goodhumoured",
		"goodnatured",
		"goodtempered",
		"goosed",
		"goosenecked",
		"goutweed",
		"grainfed",
		"grammaticalized",
		"grapeseed",
		"gratified",
		"graved",
		"gravelbed",
		"grayhaired",
		"greathearted",
		"greed",
		"greenweed",
		"grommeted",
		"groundspeed",
		"groved",
		"gruffed",
		"guiled",
		"gulled",
		"gumshoed",
		"gunkholed",
		"gussied",
		"guyed",
		"gyrostabilized",
		"hackneyed",
		"hagged",
		"haired",
		"halfcivilized",
		"halfhearted",
		"halfwitted",
		"haloed",
		"handballed",
		"handfed",
		"handfeed",
		"hardcoded",
		"hardhearted",
		"hardnosed",
		"hared",
		"harelipped",
		"hasted",
		"hatred",
		"haunched",
		"hawkeyed",
		"hayseed",
		"hayweed",
		"hearsed",
		"hearted",
		"heartshaped",
		"heavenlyminded",
		"heavyfooted",
		"heavyhearted",
		"heed",
		"heired",
		"heisted",
		"helicoptered",
		"helmed",
		"helmeted",
		"hemagglutinated",
		"hemolyzed",
		"hempseed",
		"hempweed",
		"heparinised",
		"heparinized",
		"herbed",
		"highheeled",
		"highminded",
		"highpriced",
		"highspeed",
		"highspirited",
		"hilled",
		"hipped",
		"hispanicised",
		"hocked",
		"hoed",
		"hogweed",
		"holstered",
		"homaged",
		"hoodooed",
		"hoofed",
		"hooknosed",
		"hooved",
		"horned",
		"horrified",
		"horseshoed",
		"horseweed",
		"hotbed",
		"hotblooded",
		"hothearted",
		"hotted",
		"hottempered",
		"hued",
		"humansized",
		"humidified",
		"humped",
		"hundred",
		"hutched",
		"hyperinflated",
		"hyperpigmented",
		"hyperstimulated",
		"hypertrophied",
		"hyphened",
		"hypophysectomised",
		"hypophysectomized",
		"hypopigmented",
		"hypostatised",
		"hysterectomized",
		"iconified",
		"iconised",
		"iconized",
		"ideologised",
		"illbred",
		"illconceived",
		"illdefined",
		"illdisposed",
		"illequipped",
		"illfated",
		"illfavored",
		"illfavoured",
		"illflavored",
		"illfurnished",
		"illhumored",
		"illhumoured",
		"illimited",
		"illmannered",
		"illnatured",
		"illomened",
		"illproportioned",
		"illqualified",
		"illscented",
		"illtempered",
		"illumed",
		"illusioned",
		"imbed",
		"imbossed",
		"imbued",
		"immatured",
		"impassioned",
		"impenetrated",
		"imperfected",
		"imperialised",
		"imperturbed",
		"impowered",
		"imputed",
		"inarticulated",
		"inbred",
		"inbreed",
		"incapsulated",
		"incased",
		"incrustated",
		"incrusted",
		"indebted",
		"indeed",
		"indemnified",
		"indentured",
		"indigested",
		"indisposed",
		"inexperienced",
		"infrared",
		"intensified",
		"intentioned",
		"interbedded",
		"interbred",
		"interbreed",
		"interluded",
		"introverted",
		"inured",
		"inventoried",
		"iodinated",
		"iodised",
		"irked",
		"ironfisted",
		"ironweed",
		"itchweed",
		"ivied",
		"ivyweed",
		"jagged",
		"jellified",
		"jerseyed",
		"jetlagged",
		"jetpropelled",
		"jeweled",
		"jewelled",
		"jewelweed",
		"jiggered",
		"jimmyweed",
		"jimsonweed",
		"jointweed",
		"joyweed",
		"jungled",
		"juried",
		"justiceweed",
		"justified",
		"karstified",
		"kerchiefed",
		"kettleshaped",
		"kibbled",
		"kidneyshaped",
		"kimonoed",
		"kindhearted",
		"kindred",
		"kingsized",
		"kirtled",
		"knacked",
		"knapweed",
		"kneed",
		"knobbed",
		"knobweed",
		"knopweed",
		"knotweed",
		"lakebed",
		"lakeweed",
		"lamed",
		"lamellated",
		"lanceshaped",
		"lanceted",
		"landbased",
		"lapeled",
		"lapelled",
		"largehearted",
		"lariated",
		"lased",
		"latticed",
		"lauded",
		"lavaged",
		"lavendered",
		"lawned",
		"led",
		"lefteyed",
		"legitimatised",
		"legitimatized",
		"leisured",
		"lensshaped",
		"leveed",
		"levied",
		"lichened",
		"lichenized",
		"lidded",
		"lifesized",
		"lightfingered",
		"lightfooted",
		"lighthearted",
		"lightminded",
		"lightspeed",
		"lignified",
		"likeminded",
		"lilylivered",
		"limbed",
		"linearised",
		"linearized",
		"linefeed",
		"linseed",
		"lionhearted",
		"liquefied",
		"liquified",
		"lithified",
		"liveried",
		"lobbied",
		"locoweed",
		"longarmed",
		"longhaired",
		"longhorned",
		"longlegged",
		"longnecked",
		"longsighted",
		"longwinded",
		"lopsided",
		"loudmouthed",
		"louvered",
		"louvred",
		"lowbred",
		"lowpriced",
		"lowspirited",
		"lozenged",
		"lunated",
		"lyrated",
		"lysinated",
		"maced",
		"macroaggregated",
		"macrodissected",
		"maculated",
		"madweed",
		"magnified",
		"maidenweed",
		"maladapted",
		"maladjusted",
		"malnourished",
		"malrotated",
		"maned",
		"mannered",
		"manuevered",
		"manyhued",
		"manyshaped",
		"manysided",
		"masted",
		"mealymouthed",
		"meanspirited",
		"membered",
		"membraned",
		"metaled",
		"metalized",
		"metallised",
		"metallized",
		"metamerized",
		"metathesized",
		"meted",
		"methylated",
		"mettled",
		"microbrecciated",
		"microminiaturized",
		"microstratified",
		"middleaged",
		"midsized",
		"miffed",
		"mildhearted",
		"milkweed",
		"miniskirted",
		"misactivated",
		"misaligned",
		"mischiefed",
		"misclassified",
		"misdeed",
		"misdemeaned",
		"mismannered",
		"misnomered",
		"misproportioned",
		"miswired",
		"mitred",
		"mitted",
		"mittened",
		"moneyed",
		"monocled",
		"mononucleated",
		"monospaced",
		"monotoned",
		"monounsaturated",
		"mortified",
		"moseyed",
		"motorised",
		"motorized",
		"moussed",
		"moustached",
		"muddied",
		"mugweed",
		"multiarmed",
		"multibarreled",
		"multibladed",
		"multicelled",
		"multichambered",
		"multichanneled",
		"multichannelled",
		"multicoated",
		"multidirected",
		"multiengined",
		"multifaceted",
		"multilaminated",
		"multilaned",
		"multilayered",
		"multilobed",
		"multilobulated",
		"multinucleated",
		"multipronged",
		"multisegmented",
		"multisided",
		"multispeed",
		"multistemmed",
		"multistoried",
		"multitalented",
		"multitoned",
		"multitowered",
		"multivalued",
		"mummied",
		"mummified",
		"mustached",
		"mustachioed",
		"mutinied",
		"myelinated",
		"mystified",
		"mythicised",
		"naked",
		"narcotised",
		"narrowminded",
		"natured",
		"neaped",
		"nearsighted",
		"necrosed",
		"nectared",
		"need",
		"needleshaped",
		"newfangled",
		"newlywed",
		"nibbed",
		"nimblewitted",
		"nippled",
		"nixed",
		"nobled",
		"noduled",
		"noised",
		"nonaccented",
		"nonactivated",
		"nonadsorbed",
		"nonadulterated",
		"nonaerated",
		"nonaffiliated",
		"nonaliased",
		"nonalienated",
		"nonaligned",
		"nonarchived",
		"nonarmored",
		"nonassociated",
		"nonattenuated",
		"nonblackened",
		"nonbreastfed",
		"nonbrecciated",
		"nonbuffered",
		"nonbuttered",
		"noncarbonated",
		"noncarbonized",
		"noncatalogued",
		"noncatalyzed",
		"noncategorized",
		"noncertified",
		"nonchlorinated",
		"nonciliated",
		"noncircumcised",
		"noncivilized",
		"nonclassified",
		"noncoated",
		"noncodified",
		"noncoerced",
		"noncommercialized",
		"noncommissioned",
		"noncompacted",
		"noncompiled",
		"noncomplicated",
		"noncomposed",
		"noncomputed",
		"noncomputerized",
		"nonconcerted",
		"nonconditioned",
		"nonconfirmed",
		"noncongested",
		"nonconjugated",
		"noncooled",
		"noncorrugated",
		"noncoupled",
		"noncreated",
		"noncrowded",
		"noncultured",
		"noncurated",
		"noncushioned",
		"nondecoded",
		"nondecomposed",
		"nondedicated",
		"nondeferred",
		"nondeflated",
		"nondegenerated",
		"nondegraded",
		"nondelegated",
		"nondelimited",
		"nondelineated",
		"nondemarcated",
		"nondeodorized",
		"nondeployed",
		"nonderivatized",
		"nonderived",
		"nondetached",
		"nondetailed",
		"nondifferentiated",
		"nondigested",
		"nondigitized",
		"nondilapidated",
		"nondilated",
		"nondimensionalised",
		"nondimensionalized",
		"nondirected",
		"nondisabled",
		"nondisciplined",
		"nondispersed",
		"nondisputed",
		"nondisqualified",
		"nondisrupted",
		"nondisseminated",
		"nondissipated",
		"nondissolved",
		"nondistressed",
		"nondistributed",
		"nondiversified",
		"nondiverted",
		"nondocumented",
		"nondomesticated",
		"nondoped",
		"nondrafted",
		"nondrugged",
		"nondubbed",
		"nonducted",
		"nonearthed",
		"noneclipsed",
		"nonedged",
		"nonedited",
		"nonelasticized",
		"nonelectrified",
		"nonelectroplated",
		"nonelectroporated",
		"nonelevated",
		"noneliminated",
		"nonelongated",
		"nonembedded",
		"nonembodied",
		"nonemphasized",
		"nonencapsulated",
		"nonencoded",
		"nonencrypted",
		"nonendangered",
		"nonengraved",
		"nonenlarged",
		"nonenriched",
		"nonentangled",
		"nonentrenched",
		"nonepithelized",
		"nonequilibrated",
		"nonestablished",
		"nonetched",
		"nonethoxylated",
		"nonethylated",
		"nonetiolated",
		"nonexaggerated",
		"nonexcavated",
		"nonexhausted",
		"nonexperienced",
		"nonexpired",
		"nonfabricated",
		"nonfalsified",
		"nonfeathered",
		"nonfeatured",
		"nonfed",
		"nonfederated",
		"nonfeed",
		"nonfenestrated",
		"nonfertilized",
		"nonfilamented",
		"nonfinanced",
		"nonfinished",
		"nonfinned",
		"nonfissured",
		"nonflagellated",
		"nonflagged",
		"nonflared",
		"nonflavored",
		"nonfluidized",
		"nonfluorinated",
		"nonfluted",
		"nonforested",
		"nonformalized",
		"nonformatted",
		"nonfragmented",
		"nonfragranced",
		"nonfranchised",
		"nonfreckled",
		"nonfueled",
		"nonfumigated",
		"nonfunctionalized",
		"nonfunded",
		"nongalvanized",
		"nongated",
		"nongelatinized",
		"nongendered",
		"nongeneralized",
		"nongenerated",
		"nongifted",
		"nonglazed",
		"nonglucosated",
		"nonglucosylated",
		"nonglycerinated",
		"nongraded",
		"nongrounded",
		"nonhalogenated",
		"nonhandicapped",
		"nonhospitalised",
		"nonhospitalized",
		"nonhydrated",
		"nonincorporated",
		"nonindexed",
		"noninfected",
		"noninfested",
		"noninitialized",
		"noninitiated",
		"noninoculated",
		"noninseminated",
		"noninstitutionalized",
		"noninsured",
		"nonintensified",
		"noninterlaced",
		"noninterpreted",
		"nonintroverted",
		"noninvestigated",
		"noninvolved",
		"nonirrigated",
		"nonisolated",
		"nonisomerized",
		"nonissued",
		"nonitalicized",
		"nonitemized",
		"noniterated",
		"nonjaded",
		"nonlabelled",
		"nonlaminated",
		"nonlateralized",
		"nonlayered",
		"nonlegalized",
		"nonlegislated",
		"nonlesioned",
		"nonlexicalized",
		"nonliberated",
		"nonlichenized",
		"nonlighted",
		"nonlignified",
		"nonlimited",
		"nonlinearized",
		"nonlinked",
		"nonlobed",
		"nonlobotomized",
		"nonlocalized",
		"nonlysed",
		"nonmachined",
		"nonmalnourished",
		"nonmandated",
		"nonmarginalized",
		"nonmassaged",
		"nonmatriculated",
		"nonmatted",
		"nonmatured",
		"nonmechanized",
		"nonmedicated",
		"nonmedullated",
		"nonmentioned",
		"nonmetabolized",
		"nonmetallized",
		"nonmetastasized",
		"nonmetered",
		"nonmethoxylated",
		"nonmilled",
		"nonmineralized",
		"nonmirrored",
		"nonmodeled",
		"nonmoderated",
		"nonmodified",
		"nonmonetized",
		"nonmonitored",
		"nonmortgaged",
		"nonmotorized",
		"nonmottled",
		"nonmounted",
		"nonmultithreaded",
		"nonmutilated",
		"nonmyelinated",
		"nonnormalized",
		"nonnucleated",
		"nonobjectified",
		"nonobligated",
		"nonoccupied",
		"nonoiled",
		"nonopinionated",
		"nonoxygenated",
		"nonpaginated",
		"nonpaired",
		"nonparalyzed",
		"nonparameterized",
		"nonparasitized",
		"nonpasteurized",
		"nonpatterned",
		"nonphased",
		"nonphosphatized",
		"nonphosphorized",
		"nonpierced",
		"nonpigmented",
		"nonpiloted",
		"nonpipelined",
		"nonpitted",
		"nonplussed",
		"nonpuffed",
		"nonrandomized",
		"nonrated",
		"nonrefined",
		"nonregistered",
		"nonregulated",
		"nonrelated",
		"nonretarded",
		"nonsacred",
		"nonsalaried",
		"nonsanctioned",
		"nonsaturated",
		"nonscented",
		"nonscheduled",
		"nonseasoned",
		"nonsecluded",
		"nonsegmented",
		"nonsegregated",
		"nonselected",
		"nonsolidified",
		"nonspecialized",
		"nonspored",
		"nonstandardised",
		"nonstandardized",
		"nonstratified",
		"nonstressed",
		"nonstriated",
		"nonstriped",
		"nonstructured",
		"nonstylised",
		"nonstylized",
		"nonsubmerged",
		"nonsubscripted",
		"nonsubsidised",
		"nonsubsidized",
		"nonsubstituted",
		"nonsyndicated",
		"nonsynthesised",
		"nontabulated",
		"nontalented",
		"nonthreaded",
		"nontinted",
		"nontolerated",
		"nontranslated",
		"nontunnelled",
		"nonunified",
		"nonunionised",
		"nonupholstered",
		"nonutilised",
		"nonutilized",
		"nonvalued",
		"nonvaried",
		"nonverbalized",
		"nonvitrified",
		"nonvolatilised",
		"nonvolatilized",
		"normed",
		"nosebleed",
		"notated",
		"notified",
		"nuanced",
		"nullified",
		"numerated",
		"oarweed",
		"objectified",
		"obliqued",
		"obtunded",
		"occupied",
		"octupled",
		"odored",
		"oilseed",
		"oinked",
		"oldfashioned",
		"onesided",
		"oophorectomized",
		"opaqued",
		"openhearted",
		"openminded",
		"openmouthed",
		"opiated",
		"opinionated",
		"oracled",
		"oreweed",
		"ossified",
		"outbreed",
		"outmoded",
		"outrigged",
		"outriggered",
		"outsized",
		"outskated",
		"outspeed",
		"outtopped",
		"outtrumped",
		"outvoiced",
		"outweed",
		"ovated",
		"overadorned",
		"overaged",
		"overalled",
		"overassured",
		"overbred",
		"overbreed",
		"overcomplicated",
		"overdamped",
		"overdetailed",
		"overdiversified",
		"overdyed",
		"overequipped",
		"overfatigued",
		"overfed",
		"overfeed",
		"overindebted",
		"overintensified",
		"overinventoried",
		"overmagnified",
		"overmodified",
		"overpreoccupied",
		"overprivileged",
		"overproportionated",
		"overqualified",
		"overseed",
		"oversexed",
		"oversimplified",
		"oversized",
		"oversophisticated",
		"overstudied",
		"oversulfated",
		"ovicelled",
		"ovoidshaped",
		"ozonated",
		"pacified",
		"packeted",
		"palatalized",
		"paled",
		"palsied",
		"paned",
		"panicled",
		"parabled",
		"parallelepiped",
		"parallelized",
		"parallelopiped",
		"parenthesised",
		"parodied",
		"parqueted",
		"passioned",
		"paunched",
		"pauperised",
		"pedigreed",
		"pedimented",
		"pedunculated",
		"pegged",
		"peglegged",
		"penanced",
		"pencilshaped",
		"permineralized",
		"personified",
		"petrified",
		"photodissociated",
		"photoduplicated",
		"photoed",
		"photoinduced",
		"photolysed",
		"photolyzed",
		"pied",
		"pigeoned",
		"pigtailed",
		"pigweed",
		"pilastered",
		"pillared",
		"pilloried",
		"pimpled",
		"pinealectomised",
		"pinealectomized",
		"pinfeathered",
		"pinnacled",
		"pinstriped",
		"pixellated",
		"pixilated",
		"pixillated",
		"plainclothed",
		"plantarflexed",
		"pled",
		"plumaged",
		"pocked",
		"pokeweed",
		"polychlorinated",
		"polyunsaturated",
		"ponytailed",
		"pooched",
		"poorspirited",
		"popeyed",
		"poppyseed",
		"porcelainized",
		"porched",
		"poshed",
		"pottered",
		"poxed",
		"preachified",
		"precertified",
		"preclassified",
		"preconized",
		"preinoculated",
		"premed",
		"prenotified",
		"preoccupied",
		"preposed",
		"prequalified",
		"preshaped",
		"presignified",
		"prespecified",
		"prettified",
		"pried",
		"principled",
		"proceed",
		"prophesied",
		"propounded",
		"prosed",
		"protonated",
		"proudhearted",
		"proxied",
		"pulpified",
		"pumpkinseed",
		"puppied",
		"purebred",
		"pured",
		"pureed",
		"purified",
		"pustuled",
		"putrefied",
		"pyjamaed",
		"quadruped",
		"qualified",
		"quantified",
		"quantised",
		"quantized",
		"quarried",
		"queried",
		"questoned",
		"quicktempered",
		"quickwitted",
		"quiesced",
		"quietened",
		"quizzified",
		"racemed",
		"radiosensitised",
		"ragweed",
		"raindrenched",
		"ramped",
		"rapeseed",
		"rarefied",
		"rarified",
		"ratified",
		"razoredged",
		"reaccelerated",
		"reaccompanied",
		"reachieved",
		"reacknowledged",
		"readdicted",
		"readied",
		"reamplified",
		"reannealed",
		"reassociated",
		"rebadged",
		"rebiopsied",
		"recabled",
		"recategorised",
		"receipted",
		"recentred",
		"recertified",
		"rechoreographed",
		"reclarified",
		"reclassified",
		"reconferred",
		"recrystalized",
		"rectified",
		"recursed",
		"redblooded",
		"redefied",
		"redenied",
		"rednecked",
		"redshifted",
		"redweed",
		"redyed",
		"reed",
		"reembodied",
		"reenlighted",
		"refeed",
		"refereed",
		"reflexed",
		"refortified",
		"refronted",
		"refuged",
		"reglorified",
		"reimpregnated",
		"reinitialized",
		"rejustified",
		"reliquefied",
		"remedied",
		"remodified",
		"remonetized",
		"remythologized",
		"renotified",
		"renullified",
		"renumerated",
		"reoccupied",
		"repacified",
		"repurified",
		"reputed",
		"requalified",
		"rescinded",
		"reseed",
		"reshoed",
		"resolidified",
		"resorbed",
		"respecified",
		"restudied",
		"retabulated",
		"reticulated",
		"retinted",
		"retreed",
		"retroacted",
		"reunified",
		"reverified",
		"revested",
		"revivified",
		"rewed",
		"ridgepoled",
		"riffled",
		"rightminded",
		"rigidified",
		"rinded",
		"riped",
		"rited",
		"ritualised",
		"riverbed",
		"rivered",
		"roached",
		"roadbed",
		"robotised",
		"robotized",
		"romanized",
		"rosetted",
		"rosined",
		"roughhearted",
		"rubied",
		"ruddied",
		"runcinated",
		"russeted",
		"sabled",
		"sabred",
		"sabretoothed",
		"sacheted",
		"sacred",
		"saddlebred",
		"sainted",
		"salaried",
		"samoyed",
		"sanctified",
		"satellited",
		"savvied",
		"sawtoothed",
		"scandalled",
		"scarified",
		"scarped",
		"sceptred",
		"scissored",
		"screed",
		"screwshaped",
		"scrupled",
		"sculked",
		"scurried",
		"scuttled",
		"seabed",
		"seaweed",
		"seed",
		"seedbed",
		"selfassured",
		"selforganized",
		"semicivilized",
		"semidetached",
		"semidisassembled",
		"semidomesticated",
		"semipetrified",
		"semipronated",
		"semirefined",
		"semivitrified",
		"sentineled",
		"sepaled",
		"sepalled",
		"sequinned",
		"sexed",
		"shagged",
		"shaggycoated",
		"shaggyhaired",
		"shaled",
		"shammed",
		"sharpangled",
		"sharpclawed",
		"sharpcornered",
		"sharpeared",
		"sharpedged",
		"sharpeyed",
		"sharpflavored",
		"sharplimbed",
		"sharpnosed",
		"sharpsighted",
		"sharptailed",
		"sharptongued",
		"sharptoothed",
		"sharpwitted",
		"sharpworded",
		"shed",
		"shellbed",
		"shieldshaped",
		"shimmied",
		"shinned",
		"shirted",
		"shirtsleeved",
		"shoed",
		"shortbeaked",
		"shortbilled",
		"shortbodied",
		"shorthaired",
		"shortlegged",
		"shortlimbed",
		"shortnecked",
		"shortnosed",
		"shortsighted",
		"shortsleeved",
		"shortsnouted",
		"shortstaffed",
		"shorttailed",
		"shorttempered",
		"shorttoed",
		"shorttongued",
		"shortwinded",
		"shortwinged",
		"shotted",
		"shred",
		"shrewsized",
		"shrined",
		"shrinkproofed",
		"sickbed",
		"sickleshaped",
		"sickleweed",
		"signalised",
		"signified",
		"silicified",
		"siliconized",
		"silkweed",
		"siltsized",
		"silvertongued",
		"simpleminded",
		"simplified",
		"singlebarreled",
		"singlebarrelled",
		"singlebed",
		"singlebladed",
		"singlebreasted",
		"singlecelled",
		"singlefooted",
		"singlelayered",
		"singleminded",
		"singleseeded",
		"singleshelled",
		"singlestranded",
		"singlevalued",
		"sissified",
		"sistered",
		"sixgilled",
		"sixmembered",
		"sixsided",
		"sixstoried",
		"skulled",
		"slickered",
		"slipcased",
		"slowpaced",
		"slowwitted",
		"slurried",
		"smallminded",
		"smoothened",
		"smoothtongued",
		"snaggletoothed",
		"snouted",
		"snowballed",
		"snowcapped",
		"snowshed",
		"snowshoed",
		"snubnosed",
		"so-called",
		"sofabed",
		"softhearted",
		"sogged",
		"soled",
		"solidified",
		"soliped",
		"sorbed",
		"souled",
		"spearshaped",
		"specified",
		"spectacled",
		"sped",
		"speeched",
		"speechified",
		"speed",
		"spied",
		"spiffied",
		"spindleshaped",
		"spiritualised",
		"spirted",
		"splayfooted",
		"spoonfed",
		"spoonfeed",
		"spoonshaped",
		"spreadeagled",
		"squarejawed",
		"squareshaped",
		"squareshouldered",
		"squaretoed",
		"squeegeed",
		"staled",
		"starshaped",
		"starspangled",
		"starstudded",
		"statechartered",
		"statesponsored",
		"statued",
		"steadied",
		"steampowered",
		"steed",
		"steelhearted",
		"steepled",
		"sterned",
		"stiffnecked",
		"stilettoed",
		"stimied",
		"stinkweed",
		"stirrupshaped",
		"stockinged",
		"storeyed",
		"storied",
		"stouthearted",
		"straitlaced",
		"stratified",
		"strawberryflavored",
		"streambed",
		"stressinduced",
		"stretchered",
		"strictured",
		"strongbodied",
		"strongboned",
		"strongflavored",
		"stronghearted",
		"stronglimbed",
		"strongminded",
		"strongscented",
		"strongwilled",
		"stubbled",
		"studied",
		"stultified",
		"stupefied",
		"styed",
		"stymied",
		"subclassified",
		"subcommissioned",
		"subminiaturised",
		"subsaturated",
		"subulated",
		"suburbanised",
		"suburbanized",
		"suburbed",
		"succeed",
		"sueded",
		"sugarrelated",
		"sulfurized",
		"sunbed",
		"superhardened",
		"superinfected",
		"supersimplified",
		"surefooted",
		"sweetscented",
		"swifted",
		"swordshaped",
		"syllabified",
		"syphilized",
		"tabularized",
		"talented",
		"tarpapered",
		"tautomerized",
		"teated",
		"teed",
		"teenaged",
		"teetotaled",
		"tenderhearted",
		"tentacled",
		"tenured",
		"termed",
		"ternated",
		"testbed",
		"testified",
		"theatricalised",
		"theatricalized",
		"themed",
		"thicketed",
		"thickskinned",
		"thickwalled",
		"thighed",
		"thimbled",
		"thimblewitted",
		"thonged",
		"thoroughbred",
		"thralled",
		"threated",
		"throated",
		"throughbred",
		"thyroidectomised",
		"thyroidectomized",
		"tiaraed",
		"ticktocked",
		"tidied",
		"tightassed",
		"tightfisted",
		"tightlipped",
		"timehonoured",
		"tindered",
		"tined",
		"tinselled",
		"tippytoed",
		"tiptoed",
		"titled",
		"toed",
		"tomahawked",
		"tonged",
		"toolshed",
		"toothplated",
		"toplighted",
		"torchlighted",
		"toughhearted",
		"traditionalized",
		"trajected",
		"tranced",
		"transgendered",
		"transliterated",
		"translocated",
		"transmogrified",
		"treadled",
		"treed",
		"treelined",
		"tressed",
		"trialled",
		"triangled",
		"trifoliated",
		"trifoliolated",
		"trilobed",
		"trucklebed",
		"truehearted",
		"trumpetshaped",
		"trumpetweed",
		"tuberculated",
		"tumbleweed",
		"tunnelshaped",
		"turbaned",
		"turreted",
		"turtlenecked",
		"tuskshaped",
		"tweed",
		"twigged",
		"typified",
		"ulcered",
		"ultracivilised",
		"ultracivilized",
		"ultracooled",
		"ultradignified",
		"ultradispersed",
		"ultrafiltered",
		"ultrared",
		"ultrasimplified",
		"ultrasophisticated",
		"unabandoned",
		"unabashed",
		"unabbreviated",
		"unabetted",
		"unabolished",
		"unaborted",
		"unabraded",
		"unabridged",
		"unabsolved",
		"unabsorbed",
		"unaccelerated",
		"unaccented",
		"unaccentuated",
		"unacclimatised",
		"unacclimatized",
		"unaccompanied",
		"unaccomplished",
		"unaccosted",
		"unaccredited",
		"unaccrued",
		"unaccumulated",
		"unaccustomed",
		"unacidulated",
		"unacquainted",
		"unacquitted",
		"unactivated",
		"unactuated",
		"unadapted",
		"unaddicted",
		"unadjourned",
		"unadjudicated",
		"unadjusted",
		"unadmonished",
		"unadopted",
		"unadored",
		"unadorned",
		"unadsorbed",
		"unadulterated",
		"unadvertised",
		"unaerated",
		"unaffiliated",
		"unaggregated",
		"unagitated",
		"unaimed",
		"unaired",
		"unaliased",
		"unalienated",
		"unaligned",
		"unallocated",
		"unalloyed",
		"unalphabetized",
		"unamassed",
		"unamortized",
		"unamplified",
		"unanaesthetised",
		"unanaesthetized",
		"unaneled",
		"unanesthetised",
		"unanesthetized",
		"unangered",
		"unannealed",
		"unannexed",
		"unannihilated",
		"unannotated",
		"unanointed",
		"unanticipated",
		"unappareled",
		"unappendaged",
		"unapportioned",
		"unapprenticed",
		"unapproached",
		"unappropriated",
		"unarbitrated",
		"unarched",
		"unarchived",
		"unarmored",
		"unarmoured",
		"unarticulated",
		"unascertained",
		"unashamed",
		"unaspirated",
		"unassembled",
		"unasserted",
		"unassessed",
		"unassociated",
		"unassorted",
		"unassuaged",
		"unastonished",
		"unastounded",
		"unatoned",
		"unattained",
		"unattainted",
		"unattenuated",
		"unattributed",
		"unauctioned",
		"unaudited",
		"unauthenticated",
		"unautographed",
		"unaverted",
		"unawaked",
		"unawakened",
		"unawarded",
		"unawed",
		"unbaffled",
		"unbaited",
		"unbalconied",
		"unbanded",
		"unbanished",
		"unbaptised",
		"unbaptized",
		"unbarreled",
		"unbarrelled",
		"unbattered",
		"unbeaded",
		"unbearded",
		"unbeneficed",
		"unbesotted",
		"unbetrayed",
		"unbetrothed",
		"unbiased",
		"unbiassed",
		"unbigoted",
		"unbilled",
		"unblackened",
		"unblanketed",
		"unblasphemed",
		"unblazoned",
		"unblistered",
		"unblockaded",
		"unbloodied",
		"unbodied",
		"unbonded",
		"unbothered",
		"unbounded",
		"unbracketed",
		"unbranded",
		"unbreaded",
		"unbrewed",
		"unbridged",
		"unbridled",
		"unbroached",
		"unbudgeted",
		"unbuffed",
		"unbuffered",
		"unburnished",
		"unbutchered",
		"unbuttered",
		"uncached",
		"uncaked",
		"uncalcified",
		"uncalibrated",
		"uncamouflaged",
		"uncamphorated",
		"uncanceled",
		"uncancelled",
		"uncapitalized",
		"uncarbonated",
		"uncarpeted",
		"uncased",
		"uncashed",
		"uncastrated",
		"uncatalogued",
		"uncatalysed",
		"uncatalyzed",
		"uncategorised",
		"uncatered",
		"uncaulked",
		"uncelebrated",
		"uncensored",
		"uncensured",
		"uncertified",
		"unchambered",
		"unchanneled",
		"unchannelled",
		"unchaperoned",
		"uncharacterized",
		"uncharted",
		"unchartered",
		"unchastened",
		"unchastised",
		"unchelated",
		"uncherished",
		"unchilled",
		"unchristened",
		"unchronicled",
		"uncircumcised",
		"uncircumscribed",
		"uncited",
		"uncivilised",
		"uncivilized",
		"unclarified",
		"unclassed",
		"unclassified",
		"uncleaved",
		"unclimbed",
		"unclustered",
		"uncluttered",
		"uncoagulated",
		"uncoded",
		"uncodified",
		"uncoerced",
		"uncoined",
		"uncollapsed",
		"uncollated",
		"uncolonised",
		"uncolonized",
		"uncolumned",
		"uncombined",
		"uncommented",
		"uncommercialised",
		"uncommercialized",
		"uncommissioned",
		"uncommitted",
		"uncompacted",
		"uncompartmentalized",
		"uncompartmented",
		"uncompensated",
		"uncompiled",
		"uncomplicated",
		"uncompounded",
		"uncomprehened",
		"uncomputed",
		"unconcealed",
		"unconceded",
		"unconcluded",
		"uncondensed",
		"unconditioned",
		"unconfined",
		"unconfirmed",
		"uncongested",
		"unconglomerated",
		"uncongratulated",
		"unconjugated",
		"unconquered",
		"unconsecrated",
		"unconsoled",
		"unconsolidated",
		"unconstipated",
		"unconstricted",
		"unconstructed",
		"unconsumed",
		"uncontacted",
		"uncontracted",
		"uncontradicted",
		"uncontrived",
		"unconverted",
		"unconveyed",
		"unconvicted",
		"uncooked",
		"uncooled",
		"uncoordinated",
		"uncopyrighted",
		"uncored",
		"uncorrelated",
		"uncorroborated",
		"uncosted",
		"uncounseled",
		"uncounselled",
		"uncounterfeited",
		"uncoveted",
		"uncrafted",
		"uncramped",
		"uncrannied",
		"uncrazed",
		"uncreamed",
		"uncreased",
		"uncreated",
		"uncredentialled",
		"uncredited",
		"uncrested",
		"uncrevassed",
		"uncrippled",
		"uncriticised",
		"uncriticized",
		"uncropped",
		"uncrosslinked",
		"uncrowded",
		"uncrucified",
		"uncrumbled",
		"uncrystalized",
		"uncrystallised",
		"uncrystallized",
		"uncubed",
		"uncuddled",
		"uncued",
		"unculled",
		"uncultivated",
		"uncultured",
		"uncupped",
		"uncurated",
		"uncurbed",
		"uncurried",
		"uncurtained",
		"uncushioned",
		"undamped",
		"undampened",
		"undappled",
		"undarkened",
		"undated",
		"undaubed",
		"undazzled",
		"undeadened",
		"undeafened",
		"undebated",
		"undebunked",
		"undeceased",
		"undecimalized",
		"undeciphered",
		"undecked",
		"undeclared",
		"undecomposed",
		"undeconstructed",
		"undedicated",
		"undefeated",
		"undeferred",
		"undefied",
		"undefined",
		"undeflected",
		"undefrauded",
		"undefrayed",
		"undegassed",
		"undejected",
		"undelegated",
		"undeleted",
		"undelimited",
		"undelineated",
		"undemented",
		"undemolished",
		"undemonstrated",
		"undenatured",
		"undenied",
		"undented",
		"undeodorized",
		"undepicted",
		"undeputized",
		"underaged",
		"underarmed",
		"underassessed",
		"underbred",
		"underbudgeted",
		"undercapitalised",
		"undercapitalized",
		"underdiagnosed",
		"underdocumented",
		"underequipped",
		"underexploited",
		"underexplored",
		"underfed",
		"underfeed",
		"underfurnished",
		"undergoverned",
		"undergrazed",
		"underinflated",
		"underinsured",
		"underinvested",
		"underived",
		"undermaintained",
		"undermentioned",
		"undermotivated",
		"underperceived",
		"underpowered",
		"underprivileged",
		"underqualified",
		"underrehearsed",
		"underresourced",
		"underripened",
		"undersaturated",
		"undersexed",
		"undersized",
		"underspecified",
		"understaffed",
		"understocked",
		"understressed",
		"understudied",
		"underutilised",
		"underventilated",
		"undescaled",
		"undesignated",
		"undetached",
		"undetailed",
		"undetained",
		"undeteriorated",
		"undeterred",
		"undetonated",
		"undevised",
		"undevoted",
		"undevoured",
		"undiagnosed",
		"undialed",
		"undialysed",
		"undialyzed",
		"undiapered",
		"undiffracted",
		"undigested",
		"undignified",
		"undiluted",
		"undiminished",
		"undimmed",
		"undipped",
		"undirected",
		"undisciplined",
		"undiscouraged",
		"undiscussed",
		"undisfigured",
		"undisguised",
		"undisinfected",
		"undismayed",
		"undisposed",
		"undisproved",
		"undisputed",
		"undisrupted",
		"undissembled",
		"undissipated",
		"undissociated",
		"undissolved",
		"undistilled",
		"undistorted",
		"undistracted",
		"undistributed",
		"undisturbed",
		"undiversified",
		"undiverted",
		"undivulged",
		"undoctored",
		"undocumented",
		"undomesticated",
		"undosed",
		"undramatised",
		"undrilled",
		"undrugged",
		"undubbed",
		"unduplicated",
		"uneclipsed",
		"unedged",
		"unedited",
		"unejaculated",
		"unejected",
		"unelaborated",
		"unelapsed",
		"unelected",
		"unelectrified",
		"unelevated",
		"unelongated",
		"unelucidated",
		"unemaciated",
		"unemancipated",
		"unemasculated",
		"unembalmed",
		"unembed",
		"unembellished",
		"unembodied",
		"unemboldened",
		"unemerged",
		"unenacted",
		"unencoded",
		"unencrypted",
		"unencumbered",
		"unendangered",
		"unendorsed",
		"unenergized",
		"unenfranchised",
		"unengraved",
		"unenhanced",
		"unenlarged",
		"unenlivened",
		"unenraptured",
		"unenriched",
		"unentangled",
		"unentitled",
		"unentombed",
		"unentranced",
		"unentwined",
		"unenumerated",
		"unenveloped",
		"unenvied",
		"unequaled",
		"unequalised",
		"unequalized",
		"unequalled",
		"unequipped",
		"unerased",
		"unerected",
		"uneroded",
		"unerupted",
		"unescorted",
		"unestablished",
		"unevaluated",
		"unexaggerated",
		"unexampled",
		"unexcavated",
		"unexceeded",
		"unexcelled",
		"unexecuted",
		"unexerted",
		"unexhausted",
		"unexpensed",
		"unexperienced",
		"unexpired",
		"unexploited",
		"unexplored",
		"unexposed",
		"unexpurgated",
		"unextinguished",
		"unfabricated",
		"unfaceted",
		"unfanned",
		"unfashioned",
		"unfathered",
		"unfathomed",
		"unfattened",
		"unfavored",
		"unfavoured",
		"unfazed",
		"unfeathered",
		"unfed",
		"unfeigned",
		"unfermented",
		"unfertilised",
		"unfertilized",
		"unfilleted",
		"unfiltered",
		"unfinished",
		"unflavored",
		"unflavoured",
		"unflawed",
		"unfledged",
		"unfleshed",
		"unflurried",
		"unflushed",
		"unflustered",
		"unfluted",
		"unfocussed",
		"unforested",
		"unformatted",
		"unformulated",
		"unfortified",
		"unfractionated",
		"unfractured",
		"unfragmented",
		"unfrequented",
		"unfretted",
		"unfrosted",
		"unfueled",
		"unfunded",
		"unfurnished",
		"ungarbed",
		"ungarmented",
		"ungarnished",
		"ungeared",
		"ungerminated",
		"ungifted",
		"unglazed",
		"ungoverned",
		"ungraded",
		"ungrasped",
		"ungratified",
		"ungroomed",
		"ungrounded",
		"ungrouped",
		"ungummed",
		"ungusseted",
		"unhabituated",
		"unhampered",
		"unhandicapped",
		"unhardened",
		"unharvested",
		"unhasped",
		"unhatched",
		"unheralded",
		"unhindered",
		"unhomogenised",
		"unhomogenized",
		"unhonored",
		"unhonoured",
		"unhooded",
		"unhusked",
		"unhyphenated",
		"unified",
		"unillustrated",
		"unimpacted",
		"unimpaired",
		"unimpassioned",
		"unimpeached",
		"unimpelled",
		"unimplemented",
		"unimpregnated",
		"unimprisoned",
		"unimpugned",
		"unincorporated",
		"unincubated",
		"unincumbered",
		"unindemnified",
		"unindexed",
		"unindicted",
		"unindorsed",
		"uninduced",
		"unindustrialised",
		"unindustrialized",
		"uninebriated",
		"uninfected",
		"uninflated",
		"uninflected",
		"uninhabited",
		"uninhibited",
		"uninitialised",
		"uninitialized",
		"uninitiated",
		"uninoculated",
		"uninseminated",
		"uninsulated",
		"uninsured",
		"uninterpreted",
		"unintimidated",
		"unintoxicated",
		"unintroverted",
		"uninucleated",
		"uninverted",
		"uninvested",
		"uninvolved",
		"unissued",
		"unjaundiced",
		"unjointed",
		"unjustified",
		"unkeyed",
		"unkindled",
		"unlabelled",
		"unlacquered",
		"unlamented",
		"unlaminated",
		"unlarded",
		"unlaureled",
		"unlaurelled",
		"unleaded",
		"unleavened",
		"unled",
		"unlettered",
		"unlicenced",
		"unlighted",
		"unlimbered",
		"unlimited",
		"unlined",
		"unlipped",
		"unliquidated",
		"unlithified",
		"unlittered",
		"unliveried",
		"unlobed",
		"unlocalised",
		"unlocalized",
		"unlocated",
		"unlogged",
		"unlubricated",
		"unmagnified",
		"unmailed",
		"unmaimed",
		"unmaintained",
		"unmalted",
		"unmangled",
		"unmanifested",
		"unmanipulated",
		"unmannered",
		"unmanufactured",
		"unmapped",
		"unmarred",
		"unmastered",
		"unmatriculated",
		"unmechanised",
		"unmechanized",
		"unmediated",
		"unmedicated",
		"unmentioned",
		"unmerged",
		"unmerited",
		"unmetabolised",
		"unmetabolized",
		"unmetamorphosed",
		"unmethylated",
		"unmineralized",
		"unmitigated",
		"unmoderated",
		"unmodernised",
		"unmodernized",
		"unmodified",
		"unmodulated",
		"unmolded",
		"unmolested",
		"unmonitored",
		"unmortgaged",
		"unmotivated",
		"unmotorised",
		"unmotorized",
		"unmounted",
		"unmutated",
		"unmutilated",
		"unmyelinated",
		"unnaturalised",
		"unnaturalized",
		"unnotched",
		"unnourished",
		"unobligated",
		"unobstructed",
		"unoccupied",
		"unoiled",
		"unopposed",
		"unoptimised",
		"unordained",
		"unorganised",
		"unorganized",
		"unoriented",
		"unoriginated",
		"unornamented",
		"unoxidized",
		"unoxygenated",
		"unpacified",
		"unpackaged",
		"unpaired",
		"unparalleled",
		"unparallelled",
		"unparasitized",
		"unpardoned",
		"unparodied",
		"unpartitioned",
		"unpasteurised",
		"unpasteurized",
		"unpatented",
		"unpaved",
		"unpedigreed",
		"unpenetrated",
		"unpenned",
		"unperfected",
		"unperjured",
		"unpersonalised",
		"unpersuaded",
		"unperturbed",
		"unperverted",
		"unpestered",
		"unphosphorylated",
		"unphotographed",
		"unpigmented",
		"unpiloted",
		"unpledged",
		"unploughed",
		"unplumbed",
		"unpoised",
		"unpolarized",
		"unpoliced",
		"unpolled",
		"unpopulated",
		"unposed",
		"unpowered",
		"unprecedented",
		"unpredicted",
		"unprejudiced",
		"unpremeditated",
		"unprescribed",
		"unpressurised",
		"unpressurized",
		"unpriced",
		"unprimed",
		"unprincipled",
		"unprivileged",
		"unprized",
		"unprocessed",
		"unprofaned",
		"unprofessed",
		"unprohibited",
		"unprompted",
		"unpronounced",
		"unproposed",
		"unprospected",
		"unproved",
		"unpruned",
		"unpublicised",
		"unpublicized",
		"unpublished",
		"unpuckered",
		"unpunctuated",
		"unpurified",
		"unqualified",
		"unquantified",
		"unquenched",
		"unquoted",
		"unranked",
		"unrated",
		"unratified",
		"unrebuked",
		"unreckoned",
		"unrecompensed",
		"unreconciled",
		"unreconstructed",
		"unrectified",
		"unredeemed",
		"unrefined",
		"unrefreshed",
		"unrefrigerated",
		"unregarded",
		"unregimented",
		"unregistered",
		"unregulated",
		"unrehearsed",
		"unrelated",
		"unrelieved",
		"unrelinquished",
		"unrenewed",
		"unrented",
		"unrepealed",
		"unreplicated",
		"unreprimanded",
		"unrequited",
		"unrespected",
		"unrestricted",
		"unretained",
		"unretarded",
		"unrevised",
		"unrevived",
		"unrevoked",
		"unrifled",
		"unripened",
		"unrivaled",
		"unrivalled",
		"unroasted",
		"unroofed",
		"unrounded",
		"unruffled",
		"unsalaried",
		"unsalted",
		"unsanctified",
		"unsanctioned",
		"unsanded",
		"unsaponified",
		"unsated",
		"unsatiated",
		"unsatisfied",
		"unsaturated",
		"unscaled",
		"unscarred",
		"unscathed",
		"unscented",
		"unscheduled",
		"unschooled",
		"unscreened",
		"unscripted",
		"unseamed",
		"unseared",
		"unseasoned",
		"unseeded",
		"unsegmented",
		"unsegregated",
		"unselected",
		"unserviced",
		"unsexed",
		"unshamed",
		"unshaped",
		"unsharpened",
		"unsheared",
		"unshielded",
		"unshifted",
		"unshirted",
		"unshoed",
		"unshuttered",
		"unsifted",
		"unsighted",
		"unsilenced",
		"unsimplified",
		"unsized",
		"unskewed",
		"unskinned",
		"unslaked",
		"unsliced",
		"unsloped",
		"unsmoothed",
		"unsoiled",
		"unsoldered",
		"unsolicited",
		"unsolved",
		"unsophisticated",
		"unsorted",
		"unsourced",
		"unsoured",
		"unspaced",
		"unspanned",
		"unspecialised",
		"unspecialized",
		"unspecified",
		"unspiced",
		"unstaged",
		"unstandardised",
		"unstandardized",
		"unstapled",
		"unstarched",
		"unstarred",
		"unstated",
		"unsteadied",
		"unstemmed",
		"unsterilised",
		"unsterilized",
		"unstickered",
		"unstiffened",
		"unstifled",
		"unstigmatised",
		"unstigmatized",
		"unstilted",
		"unstippled",
		"unstipulated",
		"unstirred",
		"unstocked",
		"unstoked",
		"unstoppered",
		"unstratified",
		"unstressed",
		"unstriped",
		"unstructured",
		"unstudied",
		"unstumped",
		"unsubdued",
		"unsubmitted",
		"unsubsidised",
		"unsubsidized",
		"unsubstantiated",
		"unsubstituted",
		"unsugared",
		"unsummarized",
		"unsupervised",
		"unsuprised",
		"unsurveyed",
		"unswayed",
		"unsweetened",
		"unsyllabled",
		"unsymmetrized",
		"unsynchronised",
		"unsynchronized",
		"unsyncopated",
		"unsyndicated",
		"unsynthesized",
		"unsystematized",
		"untagged",
		"untainted",
		"untalented",
		"untanned",
		"untaped",
		"untapered",
		"untargeted",
		"untarnished",
		"untattooed",
		"untelevised",
		"untempered",
		"untenanted",
		"unterminated",
		"untextured",
		"unthickened",
		"unthinned",
		"unthrashed",
		"unthreaded",
		"unthrottled",
		"unticketed",
		"untiled",
		"untilled",
		"untilted",
		"untimbered",
		"untinged",
		"untinned",
		"untinted",
		"untitled",
		"untoasted",
		"untoggled",
		"untoothed",
		"untopped",
		"untoughened",
		"untracked",
		"untrammeled",
		"untrammelled",
		"untranscribed",
		"untransduced",
		"untransferred",
		"untranslated",
		"untransmitted",
		"untraumatized",
		"untraversed",
		"untufted",
		"untuned",
		"untutored",
		"unupgraded",
		"unupholstered",
		"unutilised",
		"unutilized",
		"unuttered",
		"unvaccinated",
		"unvacuumed",
		"unvalidated",
		"unvalued",
		"unvandalized",
		"unvaned",
		"unvanquished",
		"unvapourised",
		"unvapourized",
		"unvaried",
		"unvariegated",
		"unvarnished",
		"unvented",
		"unventilated",
		"unverbalised",
		"unverbalized",
		"unverified",
		"unversed",
		"unvetted",
		"unvictimized",
		"unviolated",
		"unvitrified",
		"unvocalized",
		"unvoiced",
		"unwaged",
		"unwarped",
		"unwarranted",
		"unwaxed",
		"unweakened",
		"unweaned",
		"unwearied",
		"unweathered",
		"unwebbed",
		"unwed",
		"unwedded",
		"unweeded",
		"unweighted",
		"unwelded",
		"unwinterized",
		"unwired",
		"unwitnessed",
		"unwonted",
		"unwooded",
		"unworshipped",
		"unwounded",
		"unzoned",
		"uprated",
		"uprighted",
		"upsized",
		"upswelled",
		"vacuolated",
		"valanced",
		"valueoriented",
		"varied",
		"vascularised",
		"vascularized",
		"vasectomised",
		"vaunted",
		"vectorised",
		"vectorized",
		"vegged",
		"verdured",
		"verified",
		"vermiculated",
		"vernacularized",
		"versified",
		"verticillated",
		"vesiculated",
		"vied",
		"vilified",
		"virtualised",
		"vitrified",
		"vivified",
		"volumed",
		"vulcanised",
		"wabbled",
		"wafered",
		"waisted",
		"walleyed",
		"wared",
		"warmblooded",
		"warmhearted",
		"warted",
		"waterbased",
		"waterbed",
		"watercooled",
		"watersaturated",
		"watershed",
		"wavegenerated",
		"waxweed",
		"weakhearted",
		"weakkneed",
		"weakminded",
		"wearied",
		"weatherised",
		"weatherstriped",
		"webfooted",
		"wedgeshaped",
		"weed",
		"weeviled",
		"welladapted",
		"welladjusted",
		"wellbred",
		"wellconducted",
		"welldefined",
		"welldisposed",
		"welldocumented",
		"wellequipped",
		"wellestablished",
		"wellfavored",
		"wellfed",
		"wellgrounded",
		"wellintentioned",
		"wellmannered",
		"wellminded",
		"wellorganised",
		"wellrounded",
		"wellshaped",
		"wellstructured",
		"whinged",
		"whinnied",
		"whiplashed",
		"whiskered",
		"wholehearted",
		"whorled",
		"widebased",
		"wideeyed",
		"widemeshed",
		"widemouthed",
		"widenecked",
		"widespaced",
		"wilded",
		"wildered",
		"wildeyed",
		"willinghearted",
		"windspeed",
		"winterfed",
		"winterfeed",
		"winterised",
		"wirehaired",
		"wised",
		"witchweed",
		"woaded",
		"wombed",
		"wooded",
		"woodshed",
		"wooled",
		"woolled",
		"woollyhaired",
		"woollystemmed",
		"woolyhaired",
		"woolyminded",
		"wormholed",
		"wormshaped",
		"wrappered",
		"wretched",
		"wronghearted",
		"ycleped",
		"yolked",
		"zincified",
		"zinckified",
		"zinkified",
		"zombified"
	];
};

},{"./_apply":153,"./toInteger":332}],328:[function(require,module,exports){
/**
 * A method that returns a new empty array.
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

},{}],318:[function(require,module,exports){
var getSentences = require( "../stringProcessing/getSentences.js" );
var sentencesLength = require( "../stringProcessing/sentencesLength.js" );
var fixFloatingPoint = require( "../helpers/fixFloatingPoint" );
var sum = require( "lodash/sum" );
var reduce = require( "lodash/reduce" );

},{}],329:[function(require,module,exports){
/**
 * Calculates the standard deviation of a text
 *
 * @param {Paper} paper the Paper object to use in this count.
 * @returns {number} The calculated standard deviation
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;

},{}],330:[function(require,module,exports){
var baseSum = require('./_baseSum'),
    identity = require('./identity');

	var sentences = getSentences( text );
	var sentenceLengthResults = sentencesLength( sentences );
	var totalSentences = sentenceLengthResults.length;

	var totalWords = reduce( sentenceLengthResults, function( result, sentence ) {
		return result + sentence.sentenceLength;
	}, 0 );

},{"./_baseSum":197,"./identity":295}],331:[function(require,module,exports){
var toNumber = require('./toNumber');

	// Calculate the variations per sentence.
	var variation;
	var variations = [];

	sentenceLengthResults.map( function( sentence ) {
		variation = sentence.sentenceLength - average;
		variations.push( Math.pow( variation, 2 ) );
	} );

	var totalOfSquares = sum( variations );

},{"./toNumber":333}],332:[function(require,module,exports){
var toFinite = require('./toFinite');

		return fixFloatingPoint( Math.sqrt( dividedSquares ) );
	}

	return 0;
};

},{"../helpers/fixFloatingPoint":277,"../stringProcessing/getSentences.js":338,"../stringProcessing/sentencesLength.js":351,"lodash/reduce":211,"lodash/sum":216}],319:[function(require,module,exports){
/** @module researches/stopWordsInKeyword */

},{"./toFinite":331}],333:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isObject = require('./isObject'),
    isSymbol = require('./isSymbol');

/**
 * Checks for the amount of stop words in the keyword.
 * @param {Paper} paper The Paper object to be checked against.
 * @returns {Array} All the stopwords that were found in the keyword.
 */
module.exports = function( paper ) {
	return stopWordsInText( paper.getKeyword() );
};

},{"./stopWordsInText.js":320}],320:[function(require,module,exports){
var stopwords = require( "../config/stopwords.js" )();
var toRegex = require( "../stringProcessing/stringToRegex.js" );

/**
 * Checks a text to see if there are any stopwords, that are defined in the stopwords config.
 *
 * @param {string} text The input text to match stopwords.
 * @returns {Array} An array with all stopwords found in the text.
 */
module.exports = function( text ) {
	var i, matches = [];

	for ( i = 0; i < stopwords.length; i++ ) {
		if ( text.match( toRegex( stopwords[ i ] ) ) !== null ) {
			matches.push( stopwords[ i ] );
		}
	}

	return matches;
};

},{"../config/stopwords.js":267,"../stringProcessing/stringToRegex.js":352}],321:[function(require,module,exports){
/** @module researches/stopWordsInUrl */

var stopWordsInText = require( "./stopWordsInText.js" );

/**
 * Matches stopwords in the URL. Replaces - and _ with whitespace.
 * @param {Paper} paper The Paper object to get the url from.
 * @returns {Array} stopwords found in URL
 */
module.exports = function( paper ) {
	return stopWordsInText( paper.getUrl().replace( /[-_]/g, " " ) );
};

},{"./stopWordsInText.js":320}],322:[function(require,module,exports){
/** @module analyses/isUrlTooLong */

/**
 * Checks if an URL is too long, based on slug and relative to keyword length.
 *
 * @param {object} paper the paper to run this assessment on
 * @returns {boolean} true if the URL is too long, false if it isn't
 */
module.exports = function( paper ) {
	var urlLength = paper.getUrl().length;
	var keywordLength = paper.getKeyword().length;
	var maxUrlLength = 40;
	var maxSlugLength = 20;

	if ( urlLength > maxUrlLength	&& urlLength > keywordLength + maxSlugLength ) {
		return true;
	}
	return false;
};

},{"./isFunction":305,"./isObject":309,"./isSymbol":313}],334:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    keysIn = require('./keysIn');

/**
 * Count the words in the text
 * @param {Paper} paper The Paper object who's
 * @returns {number} The amount of words found in the text.
 */
module.exports = function( paper ) {
	return wordCount( paper.getText() );
};

},{"../stringProcessing/countWords.js":331}],324:[function(require,module,exports){
var Assessor = require( "./assessor.js" );

var introductionKeyword = require( "./assessments/introductionKeywordAssessment.js" );
var keyphraseLength = require( "./assessments/keyphraseLengthAssessment.js" );
var keywordDensity = require( "./assessments/keywordDensityAssessment.js" );
var keywordStopWords = require( "./assessments/keywordStopWordsAssessment.js" );
var metaDescriptionKeyword = require ( "./assessments/metaDescriptionKeywordAssessment.js" );
var metaDescriptionLength = require( "./assessments/metaDescriptionLengthAssessment.js" );
var subheadingsKeyword = require( "./assessments/subheadingsKeywordAssessment.js" );
var textCompetingLinks = require( "./assessments/textCompetingLinksAssessment.js" );
var textImages = require( "./assessments/textImagesAssessment.js" );
var textLength = require( "./assessments/textLengthAssessment.js" );
var textLinks = require( "./assessments/textLinksAssessment.js" );
var titleKeyword = require( "./assessments/titleKeywordAssessment.js" );
var titleLength = require( "./assessments/titleLengthAssessment.js" );
var urlKeyword = require( "./assessments/urlKeywordAssessment.js" );
var urlLength = require( "./assessments/urlLengthAssessment.js" );
var urlStopWords = require( "./assessments/urlStopWordsAssessment.js" );
/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
var SEOAssessor = function( i18n, options ) {
	Assessor.call( this, i18n, options );

	this._assessments = [
		introductionKeyword,
		keyphraseLength,
		keywordDensity,
		keywordStopWords,
		metaDescriptionKeyword,
		metaDescriptionLength,
		subheadingsKeyword,
		textCompetingLinks,
		textImages,
		textLength,
		textLinks,
		titleKeyword,
		titleLength,
		urlKeyword,
		urlLength,
		urlStopWords
	];
};

},{"./_copyObject":215,"./keysIn":317}],335:[function(require,module,exports){
var baseToString = require('./_baseToString');

/**
 * Get's the base URL for this instance of the snippet preview.
 *
 * @private
 * @this SnippetPreview
 *
 * @returns {string} The base URL.
 */
var getBaseURL = function() {
	var baseURL = this.opts.baseURL;

	/*
	 * For backwards compatibility, if no URL was passed to the snippet editor we try to retrieve the base URL from the
	 * rawData in the App. This is because the scrapers used to be responsible for retrieving the baseURL, but the base
	 * URL is static so we can just pass it to the snippet editor.
	 */
	if ( !isEmpty( this.refObj.rawData.baseUrl ) && this.opts.baseURL === defaults.baseURL ) {
		baseURL = this.refObj.rawData.baseUrl;
	}

},{"./_baseToString":199}],336:[function(require,module,exports){
var baseIteratee = require('./_baseIteratee'),
    baseUniq = require('./_baseUniq');

/**
 * Retrieves unformatted text from the data object
 *
 * @private
 * @this SnippetPreview
 *
 * @param {string} key The key to retrieve.
 * @returns {string} The unformatted text.
 */
function retrieveUnformattedText( key ) {
	return this.data[ key ];
}

module.exports = uniqBy;

},{"./_baseIteratee":186,"./_baseUniq":201}],337:[function(require,module,exports){
var baseValues = require('./_baseValues'),
    keys = require('./keys');

/**
 * Update data and DOM objects when the unformatted text is updated, here for backwards compatibility
 *
 * @private
 * @this SnippetPreview
 *
 * @param {string} key The data key to update.
 * @param {string} value The value to update.
 * @returns {void}
 */
function values(object) {
  return object ? baseValues(object, keys(object)) : [];
}

module.exports = values;

},{"./_baseValues":202,"./keys":316}],338:[function(require,module,exports){
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

},{}],339:[function(require,module,exports){
/* global wpseoPostScraperL10n */

	this.data[ key ] = value;
}

/**
 * Returns if a url has a trailing slash or not.
 *
 * @param {string} url The url to check for a trailing slash.
 * @returns {boolean} Whether or not the url contains a trailing slash.
 */
function hasTrailingSlash( url ) {
	return url.indexOf( "/" ) === ( url.length - 1 );
}

module.exports = getDescriptionPlaceholder;

},{"lodash/isUndefined":500}],340:[function(require,module,exports){
var scoreToRating = require( 'yoastseo' ).helpers.scoreToRating;
var isUndefined = require( 'lodash/isUndefined' );

/**
 * Detects if this browser has <progress> support. Also serves as a poor man's HTML5shiv.
 *
 * @private
 *
 * @returns {boolean} Whether or not the browser supports a <progress> element
 */
function hasProgressSupport() {
	var progressElement = document.createElement( "progress" );

	return !isUndefined( progressElement.max );
}

module.exports = getIndicatorForScore;

},{"lodash/isUndefined":500,"yoastseo":1}],341:[function(require,module,exports){
/* global wpseoPostScraperL10n, wpseoTermScraperL10n */

var isUndefined = require( 'lodash/isUndefined' );

/**
 * Returns a rating based on the length of the title
 *
 * @param {number} titleLength the length of the title.
 * @returns {string} The rating given based on the title length.
 */
function getTitlePlaceholder() {
	var titlePlaceholder = '';

	if ( ! isUndefined( window.wpseoPostScraperL10n ) ) {
		titlePlaceholder = window.wpseoPostScraperL10n.title_template;
	} else if ( ! isUndefined( window.wpseoTermScraperL10n ) ) {
		titlePlaceholder = window.wpseoTermScraperL10n.title_template;
	}

	if ( titlePlaceholder === '' ) {
		titlePlaceholder = '%%title%% - %%sitename%%';
	}

	return titlePlaceholder;
}

module.exports = getTitlePlaceholder;

},{"lodash/isUndefined":500}],342:[function(require,module,exports){
/* global wp, jQuery */

var isUndefined = require( 'lodash/isUndefined' );
var defaults = require( 'lodash/defaults' );

var $ = jQuery;

var defaultArguments = {
	keyword: '',
	prefix: '',
	basedOn: '',
	onActivate: function ( ) { },
	afterActivate: function ( ) { },
	active: false,

	scoreClass: 'na',
	scoreText: '',
	fallback: '',

	showKeyword: true,
	isKeywordTab: true
};

module.exports = (function() {
	'use strict';

	/**
	 * Constructor for a keyword tab object
	 * @param {Object} args
	 * @constructor
	 */
	function KeywordTab( args ) {
		defaults( args, defaultArguments );

	switch ( true ) {
		case titleLength > 0 && titleLength <= 34:
		case titleLength >= 66:
			rating = "ok";
			break;

		case titleLength >= 35 && titleLength <= 65:
			rating = "good";
			break;

		default:
			rating = "bad";
			break;
	}

	return rating;
}

/**
 * Returns a rating based on the length of the meta description
 *
 * @param {number} metaDescLength the length of the meta description.
 * @returns {string} The rating given based on the description length.
 */
function rateMetaDescLength( metaDescLength ) {
	var rating;

	switch ( true ) {
		case metaDescLength > 0 && metaDescLength <= 120:
		case metaDescLength >= 157:
			rating = "ok";
			break;

		case metaDescLength >= 120 && metaDescLength <= 157:
			rating = "good";
			break;

		default:
			rating = "bad";
			break;
	}

	return rating;
}

/**
 * Updates a progress bar
 *
 * @private
 * @this SnippetPreview
 *
 * @param {HTMLElement} element The progress element that's rendered.
 * @param {number} value The current value.
 * @param {number} maximum The maximum allowed value.
 * @param {string} rating The SEO score rating for this value.
 * @returns {void}
 */
function updateProgressBar( element, value, maximum, rating ) {
	var barElement, progress,
		allClasses = [
			"snippet-editor__progress--bad",
			"snippet-editor__progress--ok",
			"snippet-editor__progress--good"
		];

	element.value = value;
	domManipulation.removeClasses( element, allClasses );
	domManipulation.addClass( element, "snippet-editor__progress--" + rating );

	if ( !this.hasProgressSupport ) {
		barElement = element.getElementsByClassName( "snippet-editor__progress-bar" )[ 0 ];
		progress = ( value / maximum ) * 100;

		barElement.style.width = progress + "%";
	}
}

/**
 * @module snippetPreview
 */

/**
 * Defines the config and outputTarget for the SnippetPreview
 *
 * @param {Object}         opts                           - Snippet preview options.
 * @param {App}            opts.analyzerApp               - The app object the snippet preview is part of.
 * @param {Object}         opts.placeholder               - The placeholder values for the fields, will be shown as
 * actual placeholders in the inputs and as a fallback for the preview.
 * @param {string}         opts.placeholder.title         - The placeholder title.
 * @param {string}         opts.placeholder.metaDesc      - The placeholder meta description.
 * @param {string}         opts.placeholder.urlPath       - The placeholder url.
 *
 * @param {Object}         opts.defaultValue              - The default value for the fields, if the user has not
 * changed a field, this value will be used for the analyzer, preview and the progress bars.
 * @param {string}         opts.defaultValue.title        - The default title.
 * @param {string}         opts.defaultValue.metaDesc     - The default meta description.
 * it.
 *
 * @param {string}         opts.baseURL                   - The basic URL as it will be displayed in google.
 * @param {HTMLElement}    opts.targetElement             - The target element that contains this snippet editor.
 *
 * @param {Object}         opts.callbacks                 - Functions that are called on specific instances.
 * @param {Function}       opts.callbacks.saveSnippetData - Function called when the snippet data is changed.
 *
 * @param {boolean}        opts.addTrailingSlash          - Whether or not to add a trailing slash to the URL.
 * @param {string}         opts.metaDescriptionDate       - The date to display before the meta description.
 *
 * @property {App}         refObj                         - The connected app object.
 * @property {Jed}         i18n                           - The translation object.
 *
 * @property {HTMLElement} targetElement                  - The target element that contains this snippet editor.
 *
 * @property {Object}      element                        - The elements for this snippet editor.
 * @property {Object}      element.rendered               - The rendered elements.
 * @property {HTMLElement} element.rendered.title         - The rendered title element.
 * @property {HTMLElement} element.rendered.urlPath       - The rendered url path element.
 * @property {HTMLElement} element.rendered.urlBase       - The rendered url base element.
 * @property {HTMLElement} element.rendered.metaDesc      - The rendered meta description element.
 *
 * @property {HTMLElement} element.measurers.titleWidth   - The rendered title width element.
 * @property {HTMLElement} element.measurers.metaHeight   - The rendered meta height element.
 *
 * @property {Object}      element.input                  - The input elements.
 * @property {HTMLElement} element.input.title            - The title input element.
 * @property {HTMLElement} element.input.urlPath          - The url path input element.
 * @property {HTMLElement} element.input.metaDesc         - The meta description input element.
 *
 * @property {HTMLElement} element.container              - The main container element.
 * @property {HTMLElement} element.formContainer          - The form container element.
 * @property {HTMLElement} element.editToggle             - The button that toggles the editor form.
 *
 * @property {Object}      data                           - The data for this snippet editor.
 * @property {string}      data.title                     - The title.
 * @property {string}      data.urlPath                   - The url path.
 * @property {string}      data.metaDesc                  - The meta description.
 * @property {int}         data.titleWidth                - The width of the title in pixels.
 * @property {int}         data.metaHeight                - The height of the meta description in pixels.
 *
 * @property {string}      baseURL                        - The basic URL as it will be displayed in google.
 *
 * @property {boolean}     hasProgressSupport             - Whether this browser supports the <progress> element.
 *
 * @constructor
 */
var SnippetPreview = function( opts ) {
	defaultsDeep( opts, defaults );

	this.data = opts.data;

	if ( !isUndefined( opts.analyzerApp ) ) {
		this.refObj = opts.analyzerApp;
		this.i18n = this.refObj.i18n;

		this.data = {
			title: this.refObj.rawData.snippetTitle || "",
			urlPath: this.refObj.rawData.snippetCite || "",
			metaDesc: this.refObj.rawData.snippetMeta || ""
		};

		// For backwards compatibility set the metaTitle as placeholder.
		if ( !isEmpty( this.refObj.rawData.metaTitle ) ) {
			opts.placeholder.title = this.refObj.rawData.metaTitle;
		}
	}

	if ( !isElement( opts.targetElement ) ) {
		throw new Error( "The snippet preview requires a valid target element" );
	}

	this.opts = opts;
	this._currentFocus = null;
	this._currentHover = null;

	// For backwards compatibility monitor the unformatted text for changes and reflect them in the preview
	this.unformattedText = {};
	Object.defineProperty( this.unformattedText, "snippet_cite", {
		get: retrieveUnformattedText.bind( this, "urlPath" ),
		set: updateUnformattedText.bind( this, "urlPath" )
	} );
	Object.defineProperty( this.unformattedText, "snippet_meta", {
		get: retrieveUnformattedText.bind( this, "metaDesc" ),
		set: updateUnformattedText.bind( this, "metaDesc" )
	} );
	Object.defineProperty( this.unformattedText, "snippet_title", {
		get: retrieveUnformattedText.bind( this, "title" ),
		set: updateUnformattedText.bind( this, "title" )
	} );
};

/**
 * Renders snippet editor and adds it to the targetElement
 * @returns {void}
 */
SnippetPreview.prototype.renderTemplate = function() {
	var targetElement = this.opts.targetElement;

	targetElement.innerHTML = snippetEditorTemplate( {
		raw: {
			title: this.data.title,
			snippetCite: this.data.urlPath,
			meta: this.data.metaDesc
		},
		rendered: {
			title: this.formatTitle(),
			baseUrl: this.formatUrl(),
			snippetCite: this.formatCite(),
			meta: this.formatMeta()
		},
		metaDescriptionDate: this.opts.metaDescriptionDate,
		placeholder: this.opts.placeholder,
		i18n: {
			edit: this.i18n.dgettext( "js-text-analysis", "Edit snippet" ),
			title: this.i18n.dgettext( "js-text-analysis", "SEO title" ),
			slug:  this.i18n.dgettext( "js-text-analysis", "Slug" ),
			metaDescription: this.i18n.dgettext( "js-text-analysis", "Meta description" ),
			save: this.i18n.dgettext( "js-text-analysis", "Close snippet editor" ),
			snippetPreview: this.i18n.dgettext( "js-text-analysis", "Snippet preview" ),
			titleLabel: this.i18n.dgettext( "js-text-analysis", "Seo title preview:" ),
			slugLabel: this.i18n.dgettext( "js-text-analysis", "Slug preview:" ),
			metaDescriptionLabel: this.i18n.dgettext( "js-text-analysis", "Meta description preview:" ),
			snippetPreviewDescription: this.i18n.dgettext(
				"js-text-analysis",
				"You can click on each element in the preview to jump to the Snippet Editor."
			)
		}
	} );

	this.element = {
		measurers: {
			titleWidth: null,
			metaHeight: null
		},
		rendered: {
			title: document.getElementById( "snippet_title" ),
			urlBase: document.getElementById( "snippet_citeBase" ),
			urlPath: document.getElementById( "snippet_cite" ),
			metaDesc: document.getElementById( "snippet_meta" )
		},
		input: {
			title: targetElement.getElementsByClassName( "js-snippet-editor-title" )[ 0 ],
			urlPath: targetElement.getElementsByClassName( "js-snippet-editor-slug" )[ 0 ],
			metaDesc: targetElement.getElementsByClassName( "js-snippet-editor-meta-description" )[ 0 ]
		},
		progress: {
			title: targetElement.getElementsByClassName( "snippet-editor__progress-title" )[ 0 ],
			metaDesc: targetElement.getElementsByClassName( "snippet-editor__progress-meta-description" )[ 0 ]
		},
		container: document.getElementById( "snippet_preview" ),
		formContainer: targetElement.getElementsByClassName( "snippet-editor__form" )[ 0 ],
		editToggle: targetElement.getElementsByClassName( "snippet-editor__edit-button" )[ 0 ],
		closeEditor: targetElement.getElementsByClassName( "snippet-editor__submit" )[ 0 ],
		formFields: targetElement.getElementsByClassName( "snippet-editor__form-field" )
	};

	this.element.label = {
		title: this.element.input.title.parentNode,
		urlPath: this.element.input.urlPath.parentNode,
		metaDesc: this.element.input.metaDesc.parentNode
	};

	this.element.preview = {
		title: this.element.rendered.title.parentNode,
		urlPath: this.element.rendered.urlPath.parentNode,
		metaDesc: this.element.rendered.metaDesc.parentNode
	};

},{"lodash/defaults":478,"lodash/isUndefined":500}],343:[function(require,module,exports){
var defaultsDeep = require( 'lodash/defaultsDeep' );

	if ( this.hasProgressSupport ) {
		this.element.progress.title.max = titleMaxLength;
		this.element.progress.metaDesc.max = analyzerConfig.maxMeta;
	} else {
		forEach( this.element.progress, function( progressElement ) {
			domManipulation.addClass( progressElement, "snippet-editor__progress--fallback" );
		} );
	}

	this.opened = false;
	this.createMeasurementElements();
	this.updateProgressBars();
};

/**
 * Refreshes the snippet editor rendered HTML
 * @returns {void}
 */
SnippetPreview.prototype.refresh = function() {
	this.output = this.htmlOutput();
	this.renderOutput();
	this.renderSnippetStyle();
	this.measureTitle();
	this.measureMetaDescription();
	this.updateProgressBars();
};

/**
 * Returns the title as meant for the analyzer
 *
 * @private
 * @this SnippetPreview
 *
 * @returns {string} The title that is meant for the analyzer.
 */
function getAnalyzerTitle() {
	var title = this.data.title;

	if ( isEmpty( title ) ) {
		title = this.opts.defaultValue.title;
	}

	title = this.refObj.pluggable._applyModifications( "data_page_title", title );

	return stripSpaces( title );
}

/**
 * Returns the metaDescription, includes the date if it is set.
 *
 * @private
 * @this SnippetPreview
 *
 * @returns {string} The meta data for the analyzer.
 */
var getAnalyzerMetaDesc = function() {
	var metaDesc = this.data.metaDesc;

	if ( isEmpty( metaDesc ) ) {
		metaDesc = this.opts.defaultValue.metaDesc;
	}

	metaDesc = this.refObj.pluggable._applyModifications( "data_meta_desc", metaDesc );

	if ( !isEmpty( this.opts.metaDescriptionDate ) && !isEmpty( metaDesc ) ) {
		metaDesc = this.opts.metaDescriptionDate + " - " + this.data.metaDesc;
	}

	return stripSpaces( metaDesc );
};

/**
 * Returns the data from the snippet preview.
 *
 * @returns {Object} The collected data for the analyzer.
 */
SnippetPreview.prototype.getAnalyzerData = function() {
	return {
		title:    getAnalyzerTitle.call( this ),
		url:      this.data.urlPath,
		metaDesc: getAnalyzerMetaDesc.call( this )
	};
};

/**
 * Calls the event binder that has been registered using the callbacks option in the arguments of the App.
 * @returns {void}
 */
SnippetPreview.prototype.callRegisteredEventBinder = function() {
	this.refObj.callbacks.bindElementEvents( this.refObj );
};

/**
 *  Checks if title and url are set so they can be rendered in the snippetPreview
 *  @returns {void}
 */
SnippetPreview.prototype.init = function() {
	if (
		this.refObj.rawData.metaTitle !== null &&
		this.refObj.rawData.cite !== null
	) {
		this.refresh();
	}
};

/**
 * Creates html object to contain the strings for the snippetpreview
 *
 * @returns {Object} The HTML output of the collected data.
 */
SnippetPreview.prototype.htmlOutput = function() {
	var html = {};
	html.title = this.formatTitle();
	html.cite = this.formatCite();
	html.meta = this.formatMeta();
	html.url = this.formatUrl();
	return html;
};

/**
 * Formats the title for the snippet preview. If title and pageTitle are empty, sampletext is used
 *
 * @returns {string} The correctly formatted title.
 */
SnippetPreview.prototype.formatTitle = function() {
	var title = this.data.title;

	// Fallback to the default if the title is empty.
	if ( isEmpty( title ) ) {
		title = this.opts.defaultValue.title;
	}

	// For rendering we can fallback to the placeholder as well.
	if ( isEmpty( title ) ) {
		title = this.opts.placeholder.title;
	}

	// Apply modification to the title before showing it.
	if ( this.refObj.pluggable.loaded ) {
		title = this.refObj.pluggable._applyModifications( "data_page_title", title );
	}

	title = stripHTMLTags( title );

	// If a keyword is set we want to highlight it in the title.
	if ( !isEmpty( this.refObj.rawData.keyword ) ) {
		title = this.formatKeyword( title );
	}

	// As an ultimate fallback provide the user with a helpful message.
	if ( isEmpty( title ) ) {
		title = this.i18n.dgettext( "js-text-analysis", "Please provide an SEO title by editing the snippet below." );
	}

	return title;
};

/**
 * Formats the base url for the snippet preview. Removes the protocol name from the URL.
 *
 * @returns {string} Formatted base url for the snippet preview.
 */
SnippetPreview.prototype.formatUrl = function() {
	var url = getBaseURL.call( this );

	// Removes the http part of the url, google displays https:// if the website supports it.
	return url.replace( /http:\/\//ig, "" );
};

/**
 * Formats the url for the snippet preview
 *
 * @returns {string} Formatted URL for the snippet preview.
 */
SnippetPreview.prototype.formatCite = function() {
	var cite = this.data.urlPath;

	cite = replaceDiacritics( stripHTMLTags( cite ) );

	// Fallback to the default if the cite is empty.
	if ( isEmpty( cite ) ) {
		cite = this.opts.placeholder.urlPath;
	}

	if ( !isEmpty( this.refObj.rawData.keyword ) ) {
		cite = this.formatKeywordUrl( cite );
	}

	if ( this.opts.addTrailingSlash && !hasTrailingSlash( cite ) ) {
		cite = cite + "/";
	}

	// URL's cannot contain whitespace so replace it by dashes.
	cite = cite.replace( /\s/g, "-" );

	return cite;
};

/**
 * Formats the meta description for the snippet preview, if it's empty retrieves it using getMetaText.
 *
 * @returns {string} Formatted meta description.
 */
SnippetPreview.prototype.formatMeta = function() {
	var meta = this.data.metaDesc;

	// If no meta has been set, generate one.
	if ( isEmpty( meta ) ) {
		meta = this.getMetaText();
	}

},{"./getIndicatorForScore":340,"./keywordTab":342,"lodash/defaultsDeep":479}],344:[function(require,module,exports){
/* global jQuery, ajaxurl */

	meta = stripHTMLTags( meta );

	// Cut-off the meta description according to the maximum length
	meta = meta.substring( 0, analyzerConfig.maxMeta );

	if ( !isEmpty( this.refObj.rawData.keyword ) ) {
		meta = this.formatKeyword( meta );
	}

	// As an ultimate fallback provide the user with a helpful message.
	if ( isEmpty( meta ) ) {
		meta = this.i18n.dgettext( "js-text-analysis", "Please provide a meta description by editing the snippet below." );
	}

	return meta;
};

/**
 * Generates a meta description with an educated guess based on the passed text and excerpt. It uses the keyword to
 * select an appropriate part of the text. If the keyword isn't present it takes the first 156 characters of the text.
 * If both the keyword, text and excerpt are empty this function returns the sample text.
 *
 * @returns {string} A generated meta description.
 */
SnippetPreview.prototype.getMetaText = function() {
	var metaText = this.opts.defaultValue.metaDesc;

	if ( !isUndefined( this.refObj.rawData.excerpt ) && isEmpty( metaText ) ) {
		metaText = this.refObj.rawData.excerpt;
	}

	if ( !isUndefined( this.refObj.rawData.text ) && isEmpty( metaText ) ) {
		metaText = this.refObj.rawData.text;

		if ( this.refObj.pluggable.loaded ) {
			metaText = this.refObj.pluggable._applyModifications( "content", metaText );
		}
	}

	metaText = stripHTMLTags( metaText );

	return metaText.substring( 0, analyzerConfig.maxMeta );
};

/**
 * Builds an array with all indexes of the keyword
 * @returns {Array} Array with matches
 */
SnippetPreview.prototype.getIndexMatches = function() {
	var indexMatches = [];
	var i = 0;

	// Starts at 0, locates first match of the keyword.
	var match = this.refObj.rawData.text.indexOf(
		this.refObj.rawData.keyword,
		i
	);

	// Runs the loop untill no more indexes are found, and match returns -1.
	while ( match > -1 ) {
		indexMatches.push( match );

		// Pushes location to indexMatches and increase i with the length of keyword.
		i = match + this.refObj.rawData.keyword.length;
		match = this.refObj.rawData.text.indexOf(
			this.refObj.rawData.keyword,
			i
		);
	}
	return indexMatches;
};

/**
 * Builds an array with indexes of all sentence ends (select on .)
 * @returns {Array} Array with sentences.
 */
SnippetPreview.prototype.getPeriodMatches = function() {
	var periodMatches = [ 0 ];
	var match;
	var i = 0;
	while ( ( match = this.refObj.rawData.text.indexOf( ".", i ) ) > -1 ) {
		periodMatches.push( match );
		i = match + 1;
	}
	return periodMatches;
};

/**
 * Formats the keyword for use in the snippetPreview by adding <strong>-tags
 * strips unwanted characters that could break the regex or give unwanted results.
 *
 * @param {string} textString The keyword string that needs to be formatted.
 * @returns {string} The formatted keyword.
 */
UsedKeywords.prototype.updateKeywordUsage = function( keyword, response ) {
	if ( response && _isArray( response ) ) {
		this._keywordUsage[ keyword ] = response;
		this._plugin.updateKeywordUsage( this._keywordUsage );
		this._app.analyzeTimer();
	}
};

module.exports = UsedKeywords;

},{"lodash/debounce":477,"lodash/has":483,"lodash/isArray":487,"yoastseo":1}],345:[function(require,module,exports){
var $ = jQuery;

	// Match keyword case-insensitively.
	var keywordRegex = stringToRegex( keyword, "", false );

	textString = textString.replace( keywordRegex, function( str ) {
		return "<strong>" + str + "</strong>";
	} );

	// Transliterate the keyword for highlighting
	var transliterateKeyword = transliterate( keyword, this.refObj.rawData.locale );
	if ( transliterateKeyword !== keyword ) {
		keywordRegex = stringToRegex( transliterateKeyword, "", false );
		textString = textString.replace( keywordRegex, function( str ) {
			return "<strong>" + str + "</strong>";
		} );
	}
	return textString;
};

/**
 * Formats the keyword for use in the URL by accepting - and _ in stead of space and by adding
 * <strong>-tags
 * Strips unwanted characters that could break the regex or give unwanted results
 *
 * @param {string} textString The keyword string that needs to be formatted.
 * @returns {XML|string|void} The formatted keyword string to be used in the URL.
 */
SnippetPreview.prototype.formatKeywordUrl = function( textString ) {
	var keyword = sanitizeString( this.refObj.rawData.keyword );
	keyword = transliterate( keyword, this.refObj.rawData.locale );
	keyword = keyword.replace( /'/, "" );

	var dashedKeyword = keyword.replace( /\s/g, "-" );

	// Match keyword case-insensitively.
	var keywordRegex = stringToRegex( dashedKeyword, "\\-" );

	// Make the keyword bold in the textString.
	return textString.replace( keywordRegex, function( str ) {
		return "<strong>" + str + "</strong>";
	} );
};

/**
 * Renders the outputs to the elements on the page.
 * @returns {void}
 */
SnippetPreview.prototype.renderOutput = function() {
	this.element.rendered.title.innerHTML = this.output.title;
	this.element.rendered.urlPath.innerHTML = this.output.cite;
	this.element.rendered.urlBase.innerHTML = this.output.url;
	this.element.rendered.metaDesc.innerHTML = this.output.meta;
};

/**
 * Makes the rendered meta description gray if no meta description has been set by the user.
 * @returns {void}
 */
SnippetPreview.prototype.renderSnippetStyle = function() {
	var metaDescElement = this.element.rendered.metaDesc;
	var metaDesc = getAnalyzerMetaDesc.call( this );

	if ( isEmpty( metaDesc ) ) {
		domManipulation.addClass( metaDescElement, "desc-render" );
		domManipulation.removeClass( metaDescElement, "desc-default" );
	} else {
		domManipulation.addClass( metaDescElement, "desc-default" );
		domManipulation.removeClass( metaDescElement, "desc-render" );
	}
};

/**
 * Function to call init, to rerender the snippetpreview
 * @returns {void}
 */
SnippetPreview.prototype.reRender = function() {
	this.init();
};

/**
 * Checks text length of the snippetmeta and snippet title, shortens it if it is too long.
 * @param {Object} event The event to check the text length from.
 * @returns {void}
 */
SnippetPreview.prototype.checkTextLength = function( event ) {
	var text = event.currentTarget.textContent;
	switch ( event.currentTarget.id ) {
		case "snippet_meta":
			event.currentTarget.className = "desc";
			if ( text.length > analyzerConfig.maxMeta ) {
				/* eslint-disable */
				YoastSEO.app.snippetPreview.unformattedText.snippet_meta = event.currentTarget.textContent;
				/* eslint-enable */
				event.currentTarget.textContent = text.substring(
					0,
					analyzerConfig.maxMeta
				);

			}
			break;
		case "snippet_title":
			event.currentTarget.className = "title";
			if ( text.length > titleMaxLength ) {
				/* eslint-disable */
				YoastSEO.app.snippetPreview.unformattedText.snippet_title = event.currentTarget.textContent;
				/* eslint-enable */
				event.currentTarget.textContent = text.substring( 0, titleMaxLength );
			}
			break;
		default:
			break;
	}
};

},{"lodash/foreach":481,"yoastseo/js/markers/removeMarks":54}],346:[function(require,module,exports){
$ = jQuery;

/**
 * When clicked on an element in the snippet, checks fills the textContent with the data from the unformatted text.
 * This removes the keyword highlighting and modified data so the original content can be editted.
 * @param {Object} event The event to get the unformatted text from.
 * @returns {void}
 */
SnippetPreview.prototype.getUnformattedText = function( event ) {
	var currentElement = event.currentTarget.id;
	if ( typeof this.unformattedText[ currentElement ] !== "undefined" ) {
		event.currentTarget.textContent = this.unformattedText[ currentElement ];
	}
};

/**
 * When text is entered into the snippetPreview elements, the text is set in the unformattedText object.
 * This allows the visible data to be editted in the snippetPreview.
 * @param {Object} event The event to set the unformatted text from.
 * @returns {void}
 */
SnippetPreview.prototype.setUnformattedText = function( event ) {
	var elem =  event.currentTarget.id;
	this.unformattedText[ elem ] = document.getElementById( elem ).textContent;
};

},{}],347:[function(require,module,exports){
var scoreDescriptionClass = 'score-text';
var imageScoreClass = 'image yoast-logo svg';

	if ( metaDescription.length > analyzerConfig.maxMeta ) {
		domManipulation.addClass( this.element.input.metaDesc, "snippet-editor__field--invalid" );
	} else {
		domManipulation.removeClass( this.element.input.metaDesc, "snippet-editor__field--invalid" );
	}

	if ( title.length > titleMaxLength ) {
		domManipulation.addClass( this.element.input.title, "snippet-editor__field--invalid" );
	} else {
		domManipulation.removeClass( this.element.input.title, "snippet-editor__field--invalid" );
	}
};

/**
 * Updates progress bars based on the data
 * @returns {void}
 */
SnippetPreview.prototype.updateProgressBars = function() {
	var metaDescriptionRating, titleRating, metaDescription, title;

	metaDescription = getAnalyzerMetaDesc.call( this );
	title = getAnalyzerTitle.call( this );

	titleRating = rateTitleLength( title.length );
	metaDescriptionRating = rateMetaDescLength( metaDescription.length );

	updateProgressBar(
		this.element.progress.title,
		title.length,
		titleMaxLength,
		titleRating
	);

	updateProgressBar(
		this.element.progress.metaDesc,
		metaDescription.length,
		analyzerConfig.maxMeta,
		metaDescriptionRating
	);
};

/**
 * Binds the reloadSnippetText function to the blur of the snippet inputs.
 * @returns {void}
 */
SnippetPreview.prototype.bindEvents = function() {
	var targetElement,
		elems = [ "title", "slug", "meta-description" ];

	forEach( elems, function( elem ) {
		targetElement = document.getElementsByClassName( "js-snippet-editor-" + elem )[ 0 ];

		targetElement.addEventListener( "keydown", this.changedInput.bind( this ) );
		targetElement.addEventListener( "keyup", this.changedInput.bind( this ) );

		targetElement.addEventListener( "input", this.changedInput.bind( this ) );
		targetElement.addEventListener( "focus", this.changedInput.bind( this ) );
		targetElement.addEventListener( "blur", this.changedInput.bind( this ) );
	}.bind( this ) );

	this.element.editToggle.addEventListener( "click", this.toggleEditor.bind( this ) );
	this.element.closeEditor.addEventListener( "click", this.closeEditor.bind( this ) );

},{}],348:[function(require,module,exports){
$ = jQuery;

		// Make the preview element click open the editor and focus the correct input.
		previewElement.addEventListener( "click", function() {
			this.openEditor();
			inputElement.focus();
		}.bind( this ) );

		// Make focusing an input, update the carets.
		inputElement.addEventListener( "focus", function() {
			this._currentFocus = binding.inputField;

},{}],349:[function(require,module,exports){
/* global YoastSEO: true, tinyMCE, wpseoPostScraperL10n, YoastShortcodePlugin, YoastReplaceVarPlugin, console, require */

		// Make removing focus from an element, update the carets.
		inputElement.addEventListener( "blur", function() {
			this._currentFocus = null;

			this._updateFocusCarets();
		}.bind( this ) );

		previewElement.addEventListener( "mouseover", function() {
			this._currentHover = binding.inputField;

			this._updateHoverCarets();
		}.bind( this ) );

		previewElement.addEventListener( "mouseout", function() {
			this._currentHover = null;

			this._updateHoverCarets();
		}.bind( this ) );

	}.bind( this ) );
};

/**
 * Updates snippet preview on changed input. It's debounced so that we can call this function as much as we want.
 * @returns {void}
 */
SnippetPreview.prototype.changedInput = debounce( function() {
	this.updateDataFromDOM();
	this.validateFields();
	this.updateProgressBars();

	this.refresh();

	this.refObj.refresh();
}, 25 );

/**
 * Updates our data object from the DOM
 * @returns {void}
 */
SnippetPreview.prototype.updateDataFromDOM = function() {
	this.data.title = this.element.input.title.value;
	this.data.urlPath = this.element.input.urlPath.value;
	this.data.metaDesc = this.element.input.metaDesc.value;

	// Clone so the data isn't changeable.
	this.opts.callbacks.saveSnippetData( clone( this.data ) );
};

/**
 * Opens the snippet editor.
 * @returns {void}
 */
SnippetPreview.prototype.openEditor = function() {

	this.element.editToggle.setAttribute( "aria-expanded", "true" );

	// Show these elements.
	domManipulation.removeClass( this.element.formContainer, "snippet-editor--hidden" );

	this.opened = true;
};

/**
 * Closes the snippet editor.
 * @returns {void}
 */
SnippetPreview.prototype.closeEditor = function() {

	// Hide these elements.
	domManipulation.addClass( this.element.formContainer,     "snippet-editor--hidden" );

	this.element.editToggle.setAttribute( "aria-expanded", "false" );
	this.element.editToggle.focus();

	this.opened = false;
};

/**
 * Toggles the snippet editor.
 * @returns {void}
 */
SnippetPreview.prototype.toggleEditor = function() {
	if ( this.opened ) {
		this.closeEditor();
	} else {
		this.openEditor();
	}
};

/**
 * Updates carets before the preview and input fields.
 *
 * @private
 * @returns {void}
 */
SnippetPreview.prototype._updateFocusCarets = function() {
	var focusedLabel, focusedPreview;

	// Disable all carets on the labels.
	forEach( this.element.label, function( element ) {
		domManipulation.removeClass( element, "snippet-editor__label--focus" );
	} );

	// Disable all carets on the previews.
	forEach( this.element.preview, function( element ) {
		domManipulation.removeClass( element, "snippet-editor__container--focus" );
	} );

	if ( null !== this._currentFocus ) {
		focusedLabel = this.element.label[ this._currentFocus ];
		focusedPreview = this.element.preview[ this._currentFocus ];

		domManipulation.addClass( focusedLabel, "snippet-editor__label--focus" );
		domManipulation.addClass( focusedPreview, "snippet-editor__container--focus" );
	}
};

/**
 * Updates hover carets before the input fields.
 *
 * @private
 * @returns {void}
 */
SnippetPreview.prototype._updateHoverCarets = function() {
	var hoveredLabel;

	forEach( this.element.label, function( element ) {
		domManipulation.removeClass( element, "snippet-editor__label--hover" );
	} );

	if ( null !== this._currentHover ) {
		hoveredLabel = this.element.label[ this._currentHover ];

		domManipulation.addClass( hoveredLabel, "snippet-editor__label--hover" );
	}
};

/**
 * Updates the title data and the title input field. This also means the snippet editor view is updated.
 *
 * @param {string} title The title to use in the input field.
 * @returns {void}
 */
SnippetPreview.prototype.setTitle = function( title ) {
	this.element.input.title.value = title;

	this.changedInput();
};

/**
 * Updates the url path data and the url path input field. This also means the snippet editor view is updated.
 *
 * @param {string} urlPath the URL path to use in the input field.
 * @returns {void}
 */
SnippetPreview.prototype.setUrlPath = function( urlPath ) {
	this.element.input.urlPath.value = urlPath;

	this.changedInput();
};

/**
 * Updates the meta description data and the meta description input field. This also means the snippet editor view is updated.
 *
 * @param {string} metaDesc the meta description to use in the input field.
 * @returns {void}
 */
SnippetPreview.prototype.setMetaDescription = function( metaDesc ) {
	this.element.input.metaDesc.value = metaDesc;

	this.changedInput();
};

/**
 * Creates elements with the purpose to calculate the sizes of elements and puts these elemenents to the body.
 */
SnippetPreview.prototype.createMeasurementElements = function() {
	var titleElement, metaDescriptionElement, spanHolder;

	titleElement = hiddenElement( {
		width: "auto",
		whiteSpace: "nowrap"
	} );

	metaDescriptionElement = hiddenElement(
		{
			width: document.getElementById( "meta_container" ).offsetWidth + "px",
			whiteSpace: ""
		}
	);

	spanHolder = document.createElement( "div" );

	spanHolder.innerHTML = titleElement + metaDescriptionElement;

	document.body.appendChild( spanHolder );

	this.element.measurers.titleWidth = spanHolder.childNodes[ 0 ];
	this.element.measurers.metaHeight = spanHolder.childNodes[ 1 ];
};

/**
 * Copies the title text to the title measure element to calculate the width in pixels.
 */
SnippetPreview.prototype.measureTitle = function() {
	var titleWidthElement = this.element.measurers.titleWidth;

	titleWidthElement.innerHTML = this.element.rendered.title.innerHTML;

	this.data.titleWidth = titleWidthElement.offsetWidth;
};

/**
 * Copies the metadescription text to the metadescription measure element to calculate the height in pixels.
 */
SnippetPreview.prototype.measureMetaDescription = function() {
	var metaHeightElement = this.element.measurers.metaHeight;

	metaHeightElement.innerHTML = this.element.rendered.metaDesc.innerHTML;

	this.data.metaHeight = metaHeightElement.offsetHeight;
};

/* jshint ignore:start */
/* eslint-disable */

/**
 * Used to disable enter as input. Returns false to prevent enter, and preventDefault and
 * cancelBubble to prevent
 * other elements from capturing this event.
 *
 * @deprecated
 * @param {KeyboardEvent} ev
 */
SnippetPreview.prototype.disableEnter = function( ev ) {};

/**
 * Adds and remove the tooLong class when a text is too long.
 *
 * @deprecated
 * @param ev
 */
SnippetPreview.prototype.textFeedback = function( ev ) {};

/**
 * shows the edit icon corresponding to the hovered element
 *
 * @deprecated
 *
 * @param ev
 */
SnippetPreview.prototype.showEditIcon = function( ev ) {

};

/**
 * removes all editIcon-classes, sets to snippet_container
 *
 * @deprecated
 */
SnippetPreview.prototype.hideEditIcon = function() {};

/**
 * sets focus on child element of the snippet_container that is clicked. Hides the editicon.
 *
 * @deprecated
 * @param ev
 */
SnippetPreview.prototype.setFocus = function( ev ) {};
/* jshint ignore:end */
/* eslint-disable */
module.exports = SnippetPreview;

},{"../js/stringProcessing/replaceDiacritics.js":348,"../js/stringProcessing/sanitizeString.js":350,"../js/stringProcessing/stringToRegex.js":352,"../js/stringProcessing/stripHTMLTags.js":353,"../js/stringProcessing/stripSpaces.js":356,"../js/stringProcessing/transliterate.js":358,"./config/config.js":263,"./helpers/domManipulation.js":275,"./templates.js":360,"lodash/clone":167,"lodash/debounce":168,"lodash/defaultsDeep":170,"lodash/forEach":176,"lodash/isElement":188,"lodash/isEmpty":189,"lodash/isUndefined":200}],326:[function(require,module,exports){
/** @module stringProcessing/addWordboundary */

	/**
	 * Returns the marker callback method for the assessor.
	 *
	 * @returns {*|bool}
	 */
	function getMarker() {
		// Only add markers when tinyMCE is loaded and show_markers is enabled (can be disabled by a WordPress hook).
		if ( typeof tinyMCE !== 'undefined' && wpseoPostScraperL10n.show_markers === '1' ) {
			return function( paper, marks ) {
				if ( tmceHelper.isTinyMCEAvailable( tmceId ) ) {
					if ( null === decorator ) {
						decorator = tinyMCEDecorator( tinyMCE.get( tmceId ) );
					}

					decorator( paper, marks );
				}
			};
		}

		return false;
	}

	jQuery( document ).ready(function() {
		var args, postScraper, translations;

	wordBoundary = "[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›" + _extraWordBoundary + "<>]";
	wordBoundaryStart = "(^|" + wordBoundary + ")";
	wordBoundaryEnd = "($|" + wordBoundary + ")";

	return wordBoundaryStart + matchString + wordBoundaryEnd;
};

},{}],327:[function(require,module,exports){
/** @module stringProcessing/checkNofollow */

/**
 * Checks if a links has a nofollow attribute. If it has, returns Nofollow, otherwise Dofollow.
 *
 * @param {string} text The text to check against.
 * @returns {string} Returns Dofollow or Nofollow.
 */
module.exports = function( text ) {
	var linkFollow = "Dofollow";

		args = {
			// ID's of elements that need to trigger updating the analyzer.
			elementTarget: [tmceId, 'yoast_wpseo_focuskw_text_input', 'yoast_wpseo_metadesc', 'excerpt', 'editable-post-name', 'editable-post-name-full'],
			targets: {
				output: 'wpseo-pageanalysis',
				contentOutput: 'yoast-seo-content-analysis'
			},
			callbacks: {
				getData: postScraper.getData.bind( postScraper ),
				bindElementEvents: postScraper.bindElementEvents.bind( postScraper ),
				saveScores: postScraper.saveScores.bind( postScraper ),
				saveContentScore: postScraper.saveContentScore.bind( postScraper ),
				saveSnippetData: postScraper.saveSnippetData.bind( postScraper )
			},
			locale: wpseoPostScraperL10n.locale,
			marker: getMarker()
		};

var stripSpaces = require( "../stringProcessing/stripSpaces.js" );
var replaceDiacritics = require( "../stringProcessing/replaceDiacritics.js" );
var unifyWhitespace = require( "../stringProcessing/unifyWhitespace.js" );

/**
 * Removes words, duplicate spaces and sentence terminators, and words consisting of only digits
 * from the text. This is used for the flesh reading ease test.
 *
 * @param {String} text The cleaned text
 * @returns {String} The text
 */
module.exports = function( text ) {
	if ( text === "" ) {
		return text;
	}

	text = replaceDiacritics( text );
	text = text.toLocaleLowerCase();

	text = unifyWhitespace( text );

	// replace comma', hyphens etc with spaces
	text = text.replace( /[\-\;\:\,\(\)\"\'\|\“\”]/g, " " );

	// remove apostrophe
	text = text.replace( /[\’]/g, "" );

	// unify all terminators
	text = text.replace( /[.?!]/g, "." );

	// Remove double spaces
	text = stripSpaces( text );

	// add period in case it is missing
	text += ".";

	// replace newlines with spaces
	text = text.replace( /[ ]*(\n|\r\n|\r)[ ]*/g, " " );

	// remove duplicate terminators
	text = text.replace( /([\.])[\. ]+/g, "$1" );

	// pad sentence terminators
	text = text.replace( /[ ]*([\.])+/g, "$1 " );

	// Remove double spaces
	text = stripSpaces( text );

	if ( text === "." ) {
		return "";
	}

	return text;
};

},{"../stringProcessing/replaceDiacritics.js":348,"../stringProcessing/stripSpaces.js":356,"../stringProcessing/unifyWhitespace.js":359}],329:[function(require,module,exports){
/** @module stringProcessing/countSentences */

var getSentences = require( "../stringProcessing/getSentences.js" );

/**
 * Counts the number of sentences in a given string.
 *
 * @param {string} text The text used to count sentences.
 * @returns {number} The number of sentences in the text.
 */
module.exports = function( text ) {
	var sentences = getSentences( text );
	var sentenceCount = 0;
	for ( var i = 0; i < sentences.length; i++ ) {
		if ( sentences[ i ] !== "" && sentences[ i ] !== " " ) {
			sentenceCount++;
		}
	} );
}( jQuery ));

},{"./analysis/getDescriptionPlaceholder":339,"./analysis/getIndicatorForScore":340,"./analysis/getTitlePlaceholder":341,"./analysis/tabManager":343,"./analysis/usedKeywords":344,"./decorator/tinyMCE":345,"./ui/adminBar":346,"./ui/publishBox":347,"./ui/trafficLight":348,"./wp-seo-tinymce":350,"yoastseo":1,"yoastseo/js/markers/removeMarks":54}],350:[function(require,module,exports){
/* global tinyMCE, require */

},{"../stringProcessing/getSentences.js":338}],330:[function(require,module,exports){
/** @module stringProcessing/countSyllables */

var cleanText = require( "../stringProcessing/cleanText.js" );
var syllableArray = require( "../config/syllables.js" );
var arrayToRegex = require( "../stringProcessing/createRegexFromArray.js" );

/**
 * Checks the textstring for exclusion words. If they are found, returns the number of syllables these have, since
 * they are incorrectly detected with the syllablecounters based on regexes.
 *
 * @param {string} text The text to look for exclusionwords
 * @returns {number} The number of syllables found in the exclusionwords
 */
var countExclusionSyllables = function( text ) {
	var count = 0, wordArray, regex, matches;
	wordArray = syllableArray().exclusionWords;
	for ( var i = 0; i < wordArray.length; i++ ) {
		regex = new RegExp( wordArray[ i ].word, "ig" );
		matches = text.match( regex );
		if ( matches !== null ) {
			count += ( matches.length * wordArray[ i ].syllables );
		}
	}
	return count;
};

/**
 * Removes words from the text that are in the exclusion array. These words are counted
 * incorrectly in the syllable counters, so they are removed and checked sperately.
 *
 * @param {string} text The text to remove words from
 * @returns {string} The text with the exclusionwords removed
 */
var removeExclusionWords = function( text ) {
	var exclusionWords = syllableArray().exclusionWords;
	var wordArray = [];
	for ( var i = 0; i < exclusionWords.length; i++ ) {
		wordArray.push( exclusionWords[ i ].word );
	}
	return text.replace( arrayToRegex( wordArray ), "" );
};

/**
 * Counts the syllables by splitting on consonants.
 *
 * @param {string} text A text with words to count syllables.
 * @returns {number} the syllable count
 */
var countBasicSyllables = function( text ) {
	var array = text.split( " " );
	var i, j, splitWord, count = 0;

	// split textstring to individual words
	for ( i = 0; i < array.length; i++ ) {

		// split on consonants
		splitWord = array[ i ].split( /[^aeiouy]/g );

		// if the string isn't empty, a consonant was found, up the counter
		for ( j = 0; j < splitWord.length; j++ ) {
			if ( splitWord[ j ] !== "" ) {
				count++;
			}
		}
	}

	return count;
};

/**
 * Advanced syllable counter to match texstring with regexes.
 *
 * @param {String} text The text to count the syllables.
 * @param {String} operator The operator to determine which regex to use.
 * @returns {number} the amount of syllables found in string.
 */
var countAdvancedSyllables = function( text, operator ) {
	var matches, count = 0, words = text.split( " " );
	var regex = "";
	switch ( operator ) {
		case "add":
			regex = arrayToRegex( syllableArray().addSyllables, true );
			break;
		case "subtract":
			regex = arrayToRegex( syllableArray().subtractSyllables, true );
			break;
		default:
			break;
	}
	for ( var i = 0; i < words.length; i++ ) {
		matches = words[ i ].match( regex );
		if ( matches !== null ) {
			count += matches.length;
		}
	}
	return count;
};

/**
 * Counts the number of syllables in a textstring, calls exclusionwordsfunction, basic syllable
 * counter and advanced syllable counter.
 *
 * @param {String} text The text to count the syllables from.
 * @returns {int} syllable count
 */
module.exports = function( text ) {
	var count = 0;
	count += countExclusionSyllables( text );

	text = removeExclusionWords( text );
	text = cleanText( text );
	text.replace( /[.]/g, " " );

	count += countBasicSyllables( text );
	count += countAdvancedSyllables( text, "add" );
	count -= countAdvancedSyllables( text, "subtract" );

	return count;
};


},{"../config/syllables.js":268,"../stringProcessing/cleanText.js":328,"../stringProcessing/createRegexFromArray.js":332}],331:[function(require,module,exports){
/** @module stringProcessing/countWords */

},{"./decorator/tinyMCE":345,"lodash/forEach":481}],351:[function(require,module,exports){
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

},{}],352:[function(require,module,exports){
arguments[4][138][0].apply(exports,arguments)
},{"./_getNative":426,"./_root":462,"dup":138}],353:[function(require,module,exports){
arguments[4][139][0].apply(exports,arguments)
},{"./_hashClear":431,"./_hashDelete":432,"./_hashGet":433,"./_hashHas":434,"./_hashSet":435,"dup":139}],354:[function(require,module,exports){
arguments[4][140][0].apply(exports,arguments)
},{"./_listCacheClear":448,"./_listCacheDelete":449,"./_listCacheGet":450,"./_listCacheHas":451,"./_listCacheSet":452,"dup":140}],355:[function(require,module,exports){
arguments[4][141][0].apply(exports,arguments)
},{"./_getNative":426,"./_root":462,"dup":141}],356:[function(require,module,exports){
arguments[4][142][0].apply(exports,arguments)
},{"./_mapCacheClear":453,"./_mapCacheDelete":454,"./_mapCacheGet":455,"./_mapCacheHas":456,"./_mapCacheSet":457,"dup":142}],357:[function(require,module,exports){
arguments[4][143][0].apply(exports,arguments)
},{"./_getNative":426,"./_root":462,"dup":143}],358:[function(require,module,exports){
arguments[4][144][0].apply(exports,arguments)
},{"./_root":462,"dup":144}],359:[function(require,module,exports){
arguments[4][145][0].apply(exports,arguments)
},{"./_getNative":426,"./_root":462,"dup":145}],360:[function(require,module,exports){
arguments[4][146][0].apply(exports,arguments)
},{"./_MapCache":356,"./_setCacheAdd":463,"./_setCacheHas":464,"dup":146}],361:[function(require,module,exports){
arguments[4][147][0].apply(exports,arguments)
},{"./_ListCache":354,"./_stackClear":467,"./_stackDelete":468,"./_stackGet":469,"./_stackHas":470,"./_stackSet":471,"dup":147}],362:[function(require,module,exports){
arguments[4][148][0].apply(exports,arguments)
},{"./_root":462,"dup":148}],363:[function(require,module,exports){
arguments[4][149][0].apply(exports,arguments)
},{"./_root":462,"dup":149}],364:[function(require,module,exports){
arguments[4][150][0].apply(exports,arguments)
},{"./_getNative":426,"./_root":462,"dup":150}],365:[function(require,module,exports){
arguments[4][151][0].apply(exports,arguments)
},{"dup":151}],366:[function(require,module,exports){
arguments[4][152][0].apply(exports,arguments)
},{"dup":152}],367:[function(require,module,exports){
arguments[4][153][0].apply(exports,arguments)
},{"dup":153}],368:[function(require,module,exports){
/**
 * Calculates the wordcount of a certain text.
 *
 * @param {string} text The text to be counted.
 * @returns {int} The word count of the given text.
 */
module.exports = function( text ) {
	return getWords( text ).length;
};

},{"../stringProcessing/getWords.js":341}],332:[function(require,module,exports){
/** @module stringProcessing/createRegexFromArray */

var addWordBoundary = require( "../stringProcessing/addWordboundary.js" );
var map = require( "lodash/map" );

},{}],369:[function(require,module,exports){
/**
 * Creates a regex of combined strings from the input array.
 *
 * @param {array} array The array with strings
 * @param {boolean} [disableWordBoundary] Boolean indicating whether or not to disable word boundaries
 * @returns {RegExp} regex The regex created from the array.
 */
module.exports = function( array, disableWordBoundary ) {
	var regexString;
	var _disableWordBoundary = disableWordBoundary || false;

	var boundedArray = map( array, function( string ) {
		if ( _disableWordBoundary ) {
			return string;
		}
		return addWordBoundary( string );
	} );

	regexString = "(" + boundedArray.join( ")|(" ) + ")";

	return new RegExp( regexString, "ig" );
};

},{"../stringProcessing/addWordboundary.js":326,"lodash/map":203}],333:[function(require,module,exports){
/** @module stringProcessing/createRegexFromDoubleArray */

var addWordBoundary = require( "../stringProcessing/addWordboundary.js" );

},{}],370:[function(require,module,exports){
arguments[4][159][0].apply(exports,arguments)
},{"dup":159}],371:[function(require,module,exports){
/**
 * Creates a regex string of combined strings from the input array.
 * @param {array} array The array containing the various parts of a transition word combination.
 * @returns {array} The array with replaced entries.
 */
var wordCombinationToRegexString = function( array ) {
	array = array.map( function( word ) {
		return addWordBoundary( word );
	} );
	return array.join( "(.*?)" );
};

/**
 * Creates a regex of combined strings from the input array, containing arrays with two entries.
 * @param {array} array The array containing arrays.
 * @returns {RegExp} The regex created from the array.
 */
module.exports = function ( array ) {
	array = array.map( function( wordCombination ) {
		return wordCombinationToRegexString( wordCombination );
	} );
	var regexString = "(" + array.join( ")|(" ) + ")";
	return new RegExp( regexString, "ig" );
};

},{"../stringProcessing/addWordboundary.js":326}],334:[function(require,module,exports){
/** @module stringProcessing/findKeywordInUrl */

var matchTextWithTransliteration = require( "./matchTextWithTransliteration.js" );

},{}],372:[function(require,module,exports){
/**
 * Matches the keyword in the URL.
 *
 * @param {string} url The url to check for keyword
 * @param {string} keyword The keyword to check if it is in the URL
 * @param {string} locale The locale used for transliteration.
 * @returns {boolean} If a keyword is found, returns true
 */
module.exports = function( url, keyword, locale ) {
	var formatUrl = url.match( />(.*)/ig );

	if ( formatUrl !== null ) {
		formatUrl = formatUrl[ 0 ].replace( /<.*?>\s?/ig, "" );
		return matchTextWithTransliteration( formatUrl, keyword, locale ).length > 0;
	}
	return false;
};

},{}],373:[function(require,module,exports){
arguments[4][162][0].apply(exports,arguments)
},{"./eq":480,"dup":162}],374:[function(require,module,exports){
arguments[4][163][0].apply(exports,arguments)
},{"./eq":480,"dup":163}],375:[function(require,module,exports){
arguments[4][164][0].apply(exports,arguments)
},{"./eq":480,"dup":164}],376:[function(require,module,exports){
arguments[4][165][0].apply(exports,arguments)
},{"./eq":480,"dup":165}],377:[function(require,module,exports){
arguments[4][166][0].apply(exports,arguments)
},{"./_copyObject":413,"./keys":501,"dup":166}],378:[function(require,module,exports){
arguments[4][167][0].apply(exports,arguments)
},{"./_Stack":361,"./_arrayEach":368,"./_assignValue":375,"./_baseAssign":377,"./_cloneBuffer":405,"./_copyArray":412,"./_copySymbols":414,"./_getAllKeys":422,"./_getTag":429,"./_initCloneArray":437,"./_initCloneByTag":438,"./_initCloneObject":439,"./_isHostObject":440,"./isArray":487,"./isBuffer":490,"./isObject":494,"./keys":501,"dup":167}],379:[function(require,module,exports){
arguments[4][168][0].apply(exports,arguments)
},{"./isObject":494,"dup":168}],380:[function(require,module,exports){
arguments[4][170][0].apply(exports,arguments)
},{"./_baseForOwn":382,"./_createBaseEach":416,"dup":170}],381:[function(require,module,exports){
arguments[4][174][0].apply(exports,arguments)
},{"./_createBaseFor":417,"dup":174}],382:[function(require,module,exports){
arguments[4][175][0].apply(exports,arguments)
},{"./_baseFor":381,"./keys":501,"dup":175}],383:[function(require,module,exports){
arguments[4][176][0].apply(exports,arguments)
},{"./_castPath":402,"./_isKey":443,"./_toKey":473,"dup":176}],384:[function(require,module,exports){
arguments[4][177][0].apply(exports,arguments)
},{"./_arrayPush":370,"./isArray":487,"dup":177}],385:[function(require,module,exports){
var getPrototype = require('./_getPrototype');

var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

var regexAltTag = /alt=(['"])(.*?)\1/i;

/**
 * Checks for an alttag in the image and returns its content
 *
 * @param {String} text Textstring to match alt
 * @returns {String} the contents of the alttag, empty if none is set.
 */
module.exports = function( text ) {
	var alt = "";

	var matches = text.match( regexAltTag );

	if ( matches !== null ) {
		alt = stripSpaces( matches[ 2 ] );

		alt = alt.replace( /&quot;/g, "\"" );
		alt = alt.replace( /&#039;/g, "'" );
	}
	return alt;
};

},{"../stringProcessing/stripSpaces.js":356}],336:[function(require,module,exports){
/** @module stringProcessing/getAnchorsFromText */

},{"./_getPrototype":427}],386:[function(require,module,exports){
/**
 * Check for anchors in the textstring and returns them in an array.
 *
 * @param {String} text The text to check for matches.
 * @returns {Array} The matched links in text.
 */
module.exports = function( text ) {
	var matches;

	// regex matches everything between <a> and </a>
	matches = text.match( /<a(?:[^>]+)?>(.*?)<\/a>/ig );
	if ( matches === null ) {
		matches = [];
	}

	return matches;
};

},{}],387:[function(require,module,exports){
arguments[4][182][0].apply(exports,arguments)
},{"./_baseIsEqualDeep":388,"./isObject":494,"./isObjectLike":495,"dup":182}],388:[function(require,module,exports){
arguments[4][183][0].apply(exports,arguments)
},{"./_Stack":361,"./_equalArrays":419,"./_equalByTag":420,"./_equalObjects":421,"./_getTag":429,"./_isHostObject":440,"./isArray":487,"./isTypedArray":499,"dup":183}],389:[function(require,module,exports){
arguments[4][184][0].apply(exports,arguments)
},{"./_Stack":361,"./_baseIsEqual":387,"dup":184}],390:[function(require,module,exports){
arguments[4][186][0].apply(exports,arguments)
},{"./_baseMatches":393,"./_baseMatchesProperty":394,"./identity":485,"./isArray":487,"./property":506,"dup":186}],391:[function(require,module,exports){
arguments[4][187][0].apply(exports,arguments)
},{"dup":187}],392:[function(require,module,exports){
arguments[4][188][0].apply(exports,arguments)
},{"./_Reflect":358,"./_iteratorToArray":447,"dup":188}],393:[function(require,module,exports){
arguments[4][190][0].apply(exports,arguments)
},{"./_baseIsMatch":389,"./_getMatchData":425,"./_matchesStrictComparable":459,"dup":190}],394:[function(require,module,exports){
arguments[4][191][0].apply(exports,arguments)
},{"./_baseIsEqual":387,"./_isKey":443,"./_isStrictComparable":446,"./_matchesStrictComparable":459,"./_toKey":473,"./get":482,"./hasIn":484,"dup":191}],395:[function(require,module,exports){
arguments[4][192][0].apply(exports,arguments)
},{"./_Stack":361,"./_arrayEach":368,"./_assignMergeValue":374,"./_baseMergeDeep":396,"./isArray":487,"./isObject":494,"./isTypedArray":499,"./keysIn":502,"dup":192}],396:[function(require,module,exports){
arguments[4][193][0].apply(exports,arguments)
},{"./_assignMergeValue":374,"./_baseClone":378,"./_copyArray":412,"./isArguments":486,"./isArray":487,"./isArrayLikeObject":489,"./isFunction":491,"./isObject":494,"./isPlainObject":496,"./isTypedArray":499,"./toPlainObject":512,"dup":193}],397:[function(require,module,exports){
arguments[4][194][0].apply(exports,arguments)
},{"dup":194}],398:[function(require,module,exports){
arguments[4][195][0].apply(exports,arguments)
},{"./_baseGet":383,"dup":195}],399:[function(require,module,exports){
arguments[4][198][0].apply(exports,arguments)
},{"dup":198}],400:[function(require,module,exports){
var arrayMap = require('./_arrayMap');

/**
 * The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
 * of key-value pairs for `object` corresponding to the property names of `props`.
 *
 * @param {string} text String with anchor tag.
 * @param {string} url Url to match against.
 * @returns {string} The link type (other, external or internal).
 */

module.exports = baseToPairs;

},{"./_arrayMap":369}],401:[function(require,module,exports){
arguments[4][199][0].apply(exports,arguments)
},{"./_Symbol":362,"./isSymbol":498,"dup":199}],402:[function(require,module,exports){
arguments[4][204][0].apply(exports,arguments)
},{"./_stringToPath":472,"./isArray":487,"dup":204}],403:[function(require,module,exports){
arguments[4][205][0].apply(exports,arguments)
},{"dup":205}],404:[function(require,module,exports){
arguments[4][206][0].apply(exports,arguments)
},{"./_Uint8Array":363,"dup":206}],405:[function(require,module,exports){
arguments[4][207][0].apply(exports,arguments)
},{"dup":207}],406:[function(require,module,exports){
arguments[4][208][0].apply(exports,arguments)
},{"./_cloneArrayBuffer":404,"dup":208}],407:[function(require,module,exports){
arguments[4][209][0].apply(exports,arguments)
},{"./_addMapEntry":365,"./_arrayReduce":371,"./_mapToArray":458,"dup":209}],408:[function(require,module,exports){
arguments[4][210][0].apply(exports,arguments)
},{"dup":210}],409:[function(require,module,exports){
arguments[4][211][0].apply(exports,arguments)
},{"./_addSetEntry":366,"./_arrayReduce":371,"./_setToArray":465,"dup":211}],410:[function(require,module,exports){
arguments[4][212][0].apply(exports,arguments)
},{"./_Symbol":362,"dup":212}],411:[function(require,module,exports){
arguments[4][213][0].apply(exports,arguments)
},{"./_cloneArrayBuffer":404,"dup":213}],412:[function(require,module,exports){
arguments[4][214][0].apply(exports,arguments)
},{"dup":214}],413:[function(require,module,exports){
arguments[4][215][0].apply(exports,arguments)
},{"./_assignValue":375,"dup":215}],414:[function(require,module,exports){
arguments[4][216][0].apply(exports,arguments)
},{"./_copyObject":413,"./_getSymbols":428,"dup":216}],415:[function(require,module,exports){
arguments[4][218][0].apply(exports,arguments)
},{"./_isIterateeCall":442,"./rest":507,"dup":218}],416:[function(require,module,exports){
arguments[4][219][0].apply(exports,arguments)
},{"./isArrayLike":488,"dup":219}],417:[function(require,module,exports){
arguments[4][220][0].apply(exports,arguments)
},{"dup":220}],418:[function(require,module,exports){
var baseToPairs = require('./_baseToPairs'),
    getTag = require('./_getTag'),
    mapToArray = require('./_mapToArray'),
    setToPairs = require('./_setToPairs');

var getSubheadings = require( "./getSubheadings.js" ).getSubheadings;

// All characters that indicate a sentence delimiter.
var sentenceDelimiters = ".?!:;";

/**
 * Checks if the period is followed with a whitespace. If not, it is no ending of a sentence.
 *
 * @param {string} text The text to split in sentences.
 * @param {number} index The current index to look for.
 * @returns {boolean} True if it doesn't match a whitespace.
 */
function createToPairs(keysFunc) {
  return function(object) {
    var tag = getTag(object);
    if (tag == mapTag) {
      return mapToArray(object);
    }
    if (tag == setTag) {
      return setToPairs(object);
    }
    return baseToPairs(object, keysFunc(object));
  };
}

module.exports = createToPairs;

},{"./_baseToPairs":400,"./_getTag":429,"./_mapToArray":458,"./_setToPairs":466}],419:[function(require,module,exports){
arguments[4][222][0].apply(exports,arguments)
},{"./_SetCache":360,"./_arraySome":372,"dup":222}],420:[function(require,module,exports){
arguments[4][223][0].apply(exports,arguments)
},{"./_Symbol":362,"./_Uint8Array":363,"./_equalArrays":419,"./_mapToArray":458,"./_setToArray":465,"dup":223}],421:[function(require,module,exports){
arguments[4][224][0].apply(exports,arguments)
},{"./_baseHas":385,"./keys":501,"dup":224}],422:[function(require,module,exports){
arguments[4][225][0].apply(exports,arguments)
},{"./_baseGetAllKeys":384,"./_getSymbols":428,"./keys":501,"dup":225}],423:[function(require,module,exports){
arguments[4][226][0].apply(exports,arguments)
},{"./_baseProperty":397,"dup":226}],424:[function(require,module,exports){
arguments[4][227][0].apply(exports,arguments)
},{"./_isKeyable":444,"dup":227}],425:[function(require,module,exports){
var isStrictComparable = require('./_isStrictComparable'),
    toPairs = require('./toPairs');

/**
 * Checks if the character in the next sentence is a capital letter or a number. If not, this period is not the end
 * of a sentence.
 *
 * @param {string} text The text to split in sentences.
 * @param {Array} positions The array with positions of periods in the text.
 * @param {number} i The current iterator.
 * @returns {boolean} False if it doesn't match a capital.
 */
var invalidateOnCapital = function( text, positions, i ) {

	// The current index + 1 should be the first character of the new sentence. We use a range of 1, since we only need the first character.
	var firstChar = text.substring( positions[ i ] + 1, positions[ i ] + 2 );

},{"./_isStrictComparable":446,"./toPairs":511}],426:[function(require,module,exports){
var isNative = require('./isNative');

/**
 * Filters the positions that aren't valid endings to sentences.
 * @param {string} text The text to split in sentences.
 * @param {Array} positions The array with positions of periods in the text.
 * @returns {Array} The filtered positions.
 */
function getNative(object, key) {
  var value = object[key];
  return isNative(value) ? value : undefined;
}

module.exports = getNative;

},{"./isNative":493}],427:[function(require,module,exports){
arguments[4][230][0].apply(exports,arguments)
},{"dup":230}],428:[function(require,module,exports){
/** Built-in value references. */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;

/**
 * Split sentences based on index.
 *
 * @param {Array} positions The array with positions of periods in the text.
 * @param {string} text The text to split in sentences.
 * @returns {Array} Array with sentences.
 */
var splitOnIndex = function( positions, text ) {
	var curIndex = 0, sentences = [];

},{}],429:[function(require,module,exports){
arguments[4][232][0].apply(exports,arguments)
},{"./_DataView":352,"./_Map":355,"./_Promise":357,"./_Set":359,"./_WeakMap":364,"./_toSource":474,"dup":232}],430:[function(require,module,exports){
arguments[4][234][0].apply(exports,arguments)
},{"./_castPath":402,"./_isIndex":441,"./_isKey":443,"./_toKey":473,"./isArguments":486,"./isArray":487,"./isLength":492,"./isString":497,"dup":234}],431:[function(require,module,exports){
arguments[4][235][0].apply(exports,arguments)
},{"./_nativeCreate":461,"dup":235}],432:[function(require,module,exports){
arguments[4][236][0].apply(exports,arguments)
},{"dup":236}],433:[function(require,module,exports){
arguments[4][237][0].apply(exports,arguments)
},{"./_nativeCreate":461,"dup":237}],434:[function(require,module,exports){
arguments[4][238][0].apply(exports,arguments)
},{"./_nativeCreate":461,"dup":238}],435:[function(require,module,exports){
arguments[4][239][0].apply(exports,arguments)
},{"./_nativeCreate":461,"dup":239}],436:[function(require,module,exports){
arguments[4][240][0].apply(exports,arguments)
},{"./_baseTimes":399,"./isArguments":486,"./isArray":487,"./isLength":492,"./isString":497,"dup":240}],437:[function(require,module,exports){
arguments[4][242][0].apply(exports,arguments)
},{"dup":242}],438:[function(require,module,exports){
arguments[4][243][0].apply(exports,arguments)
},{"./_cloneArrayBuffer":404,"./_cloneDataView":406,"./_cloneMap":407,"./_cloneRegExp":408,"./_cloneSet":409,"./_cloneSymbol":410,"./_cloneTypedArray":411,"dup":243}],439:[function(require,module,exports){
arguments[4][244][0].apply(exports,arguments)
},{"./_baseCreate":379,"./_getPrototype":427,"./_isPrototype":445,"dup":244}],440:[function(require,module,exports){
arguments[4][246][0].apply(exports,arguments)
},{"dup":246}],441:[function(require,module,exports){
arguments[4][247][0].apply(exports,arguments)
},{"dup":247}],442:[function(require,module,exports){
arguments[4][248][0].apply(exports,arguments)
},{"./_isIndex":441,"./eq":480,"./isArrayLike":488,"./isObject":494,"dup":248}],443:[function(require,module,exports){
arguments[4][249][0].apply(exports,arguments)
},{"./isArray":487,"./isSymbol":498,"dup":249}],444:[function(require,module,exports){
arguments[4][250][0].apply(exports,arguments)
},{"dup":250}],445:[function(require,module,exports){
arguments[4][252][0].apply(exports,arguments)
},{"dup":252}],446:[function(require,module,exports){
arguments[4][253][0].apply(exports,arguments)
},{"./isObject":494,"dup":253}],447:[function(require,module,exports){
arguments[4][254][0].apply(exports,arguments)
},{"dup":254}],448:[function(require,module,exports){
arguments[4][255][0].apply(exports,arguments)
},{"dup":255}],449:[function(require,module,exports){
arguments[4][256][0].apply(exports,arguments)
},{"./_assocIndexOf":376,"dup":256}],450:[function(require,module,exports){
arguments[4][257][0].apply(exports,arguments)
},{"./_assocIndexOf":376,"dup":257}],451:[function(require,module,exports){
arguments[4][258][0].apply(exports,arguments)
},{"./_assocIndexOf":376,"dup":258}],452:[function(require,module,exports){
arguments[4][259][0].apply(exports,arguments)
},{"./_assocIndexOf":376,"dup":259}],453:[function(require,module,exports){
arguments[4][260][0].apply(exports,arguments)
},{"./_Hash":353,"./_ListCache":354,"./_Map":355,"dup":260}],454:[function(require,module,exports){
arguments[4][261][0].apply(exports,arguments)
},{"./_getMapData":424,"dup":261}],455:[function(require,module,exports){
arguments[4][262][0].apply(exports,arguments)
},{"./_getMapData":424,"dup":262}],456:[function(require,module,exports){
arguments[4][263][0].apply(exports,arguments)
},{"./_getMapData":424,"dup":263}],457:[function(require,module,exports){
arguments[4][264][0].apply(exports,arguments)
},{"./_getMapData":424,"dup":264}],458:[function(require,module,exports){
arguments[4][265][0].apply(exports,arguments)
},{"dup":265}],459:[function(require,module,exports){
arguments[4][266][0].apply(exports,arguments)
},{"dup":266}],460:[function(require,module,exports){
arguments[4][267][0].apply(exports,arguments)
},{"./_baseMerge":395,"./isObject":494,"dup":267}],461:[function(require,module,exports){
arguments[4][268][0].apply(exports,arguments)
},{"./_getNative":426,"dup":268}],462:[function(require,module,exports){
(function (global){
var checkGlobal = require('./_checkGlobal');

		curIndex = index;
	} );
	return sentences;
};

/**
 * Finds subheadings in each sentence and returns each position.
 * @param {string} text The sentence to check for subheadings.
 * @returns {Array} The position of each subsentence.
 */
var findSubheadings = function( text ) {
	var subheadings = getSubheadings( text );
	return map ( subheadings, function( subheading ) {
		return subheading.index + subheading[ 0 ].length;
	} );
};

/**
 * Returns sentences in a string.
 * @param {String} text The string to count sentences in.
 * @returns {Array} Sentences found in the text.
 */
module.exports = function( text ) {

	// Store the original text before changing terminators, so we can return the unaltered sentences.
	var originalText = text;

	// Unify all terminators.
	text = text.replace( new RegExp( "[" + sentenceDelimiters + "]", "g" ), "." );

	// Add period in case it is missing.
	text += ".";
	var positions = [];
	var periodIndex = text.indexOf( "." );
	while ( periodIndex > -1 ) {
		positions.push( periodIndex + 1 );
		periodIndex = text.indexOf( ".", periodIndex + 1 );
	}
	positions = filterPositions( originalText, positions );

	// Add the positions of subheadings.
	positions = positions.concat( findSubheadings( text ) );
	positions = positions.sort( function( a, b ) {
		return a - b;
	} );
	var sentences = splitOnIndex( positions, originalText );

	// Remove whitespace on start of sentence.
	sentences = map( sentences, function( sentence ) {
		return sentence.replace( /^\s/, "" );
	} );

	return filter( sentences, function( sentence ) {
		return ( !isEmpty( sentence ) );
	} );
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./_checkGlobal":403}],463:[function(require,module,exports){
arguments[4][270][0].apply(exports,arguments)
},{"dup":270}],464:[function(require,module,exports){
arguments[4][271][0].apply(exports,arguments)
},{"dup":271}],465:[function(require,module,exports){
arguments[4][272][0].apply(exports,arguments)
},{"dup":272}],466:[function(require,module,exports){
/**
 * Returns all texts per subheading.
 * @param {string} text The text to analyze from.
 * @returns {Array} an array with text blocks per subheading.
 */
module.exports = function( text ) {
	/*
	 matching this in a regex is pretty hard, since we need to find a way for matching the text after a heading, and before the end of the text.
	 The hard thing capturing this is with a capture, it captures the next subheading as well, so it skips the next part of the text,
	 since the subheading is already matched.
	 For now we use this method to be sure we capture the right blocks of text. We remove all | 's from text,
	 then replace all headings with a | and split on a |.
	 */
	text = text.replace( /\|/ig, "" );
	text = text.replace( /<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/ig, "|" );
	var subheadings =  text.split( "|" );

	// we never need the first entry, if the text starts with a subheading it will be empty, and if the text doesn't start with a subheading, the
	// text doesnt't belong to a subheading, so it can be removed
	subheadings.shift();
	return subheadings;
};

module.exports = setToPairs;

},{}],467:[function(require,module,exports){
arguments[4][273][0].apply(exports,arguments)
},{"./_ListCache":354,"dup":273}],468:[function(require,module,exports){
arguments[4][274][0].apply(exports,arguments)
},{"dup":274}],469:[function(require,module,exports){
arguments[4][275][0].apply(exports,arguments)
},{"dup":275}],470:[function(require,module,exports){
arguments[4][276][0].apply(exports,arguments)
},{"dup":276}],471:[function(require,module,exports){
arguments[4][277][0].apply(exports,arguments)
},{"./_ListCache":354,"./_MapCache":356,"dup":277}],472:[function(require,module,exports){
var memoize = require('./memoize'),
    toString = require('./toString');


},{}],340:[function(require,module,exports){
var map = require( "lodash/map" );

/**
 * Gets all subheadings from the text and returns these in an array.
 *
 * @param {string} text The text to return the headings from.
 * @returns {Array} Matches of subheadings in the text, first key is everything including tags, second is the heading
 *                  level, third is the content of the subheading.
 */
function getSubheadings( text ) {
	var subheadings = [];
	var regex = /<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/ig;
	var match;

	while ( ( match = regex.exec( text ) ) !== null ) {
		subheadings.push( match );
	}

	return subheadings;
}

},{"./memoize":503,"./toString":513}],473:[function(require,module,exports){
arguments[4][279][0].apply(exports,arguments)
},{"./isSymbol":498,"dup":279}],474:[function(require,module,exports){
arguments[4][280][0].apply(exports,arguments)
},{"dup":280}],475:[function(require,module,exports){
arguments[4][281][0].apply(exports,arguments)
},{"./_copyObject":413,"./_createAssigner":415,"./keysIn":502,"dup":281}],476:[function(require,module,exports){
/**
 * Gets the content of subheadings in the text
 *
 * @param {string} text The text to get the subheading contents from.
 * @returns {Array<string>} A list of all the subheadings with their content.
 */
function getSubheadingContents( text ) {
	var subheadings = getSubheadings( text );

	subheadings = map( subheadings, function( subheading ) {
		return subheading[0];
	} );

},{}],477:[function(require,module,exports){
var isObject = require('./isObject'),
    now = require('./now'),
    toNumber = require('./toNumber');

module.exports = {
	getSubheadings: getSubheadings,
	getSubheadingContents: getSubheadingContents
};

},{"lodash/map":203}],341:[function(require,module,exports){
/** @module stringProcessing/countWords */

var stripTags = require( "../stringProcessing/stripHTMLTags.js" );
var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

/**
 * Returns an array with words used in the text.
 *
 * @param {string} text The text to be counted.
 * @returns {Array} The array with all words.
 */
module.exports = function( text ) {
	text = stripSpaces( stripTags( text ) );
	if ( text === "" ) {
		return [];
	}

	return text.split( /\s/g );
};


},{"../stringProcessing/stripHTMLTags.js":353,"../stringProcessing/stripSpaces.js":356}],342:[function(require,module,exports){
/** @module stringProcessing/imageInText */

var matchStringWithRegex = require( "./matchStringWithRegex.js" );

/**
 * Checks the text for images.
 *
 * @param {string} text The textstring to check for images
 * @returns {Array} Array containing all types of found images
 */
module.exports = function( text ) {
	return matchStringWithRegex( text, "<img(?:[^>]+)?>" );
};

},{"./matchStringWithRegex.js":344}],343:[function(require,module,exports){
var map = require( "lodash/map" );

/**
 * Matches the paragraphs in <p>-tags and returns the text in them.
 * @param {string} text The text to match paragraph in.
 * @returns {array} An array containing all paragraphs texts.
 */
var getParagraphsInTags = function ( text ) {
	var paragraphs = [];
	// Matches everything between the <p> and </p> tags.
	var regex = /<p(?:[^>]+)?>(.*?)<\/p>/ig;
	var match;

	while ( ( match = regex.exec( text ) ) !== null ) {
		paragraphs.push( match );
	}

	// Returns only the text from within the paragraph tags.
	return map( paragraphs, function( paragraph ) {
		return paragraph[ 1 ];
	} );
};

/**
 * Returns an array with all paragraphs from the text.
 * @param {string} text The text to match paragraph in.
 * @returns {array} The array containing all paragraphs from the text.
 */
module.exports = function( text ) {
	var paragraphs = getParagraphsInTags( text );

	if ( paragraphs.length > 0 ) {
		return paragraphs;
	}

	// If no <p> tags found, split on double linebreaks.
	paragraphs = text.split( "\n\n" );
	if ( paragraphs.length > 0 ) {
		return paragraphs;
	}
	// If no paragraphs are found, return an array containing the entire text.
	return [ text ];
};

},{"lodash/map":203}],344:[function(require,module,exports){
/** @module stringProcessing/matchStringWithRegex */

/**
 * Checks a string with a regex, return all matches found with that regex.
 *
 * @param {String} text The text to match the
 * @param {String} regexString A string to use as regex.
 * @returns {Array} Array with matches, empty array if no matches found.
 */
module.exports = function( text, regexString ) {
	var regex = new RegExp( regexString, "ig" );
	var matches = text.match( regex );

	if ( matches === null ) {
		matches = [];
	}

	return matches;
};

},{}],345:[function(require,module,exports){
var map = require( "lodash/map" );
var addWordBoundary = require( "./addWordboundary.js" );
var stripSpaces = require( "./stripSpaces.js" );
var transliterate = require( "./transliterate.js" );

/**
 * Creates a regex from the keyword with included wordboundaries.
 * @param {string} keyword The keyword to create a regex from.
 * @returns {RegExp} Regular expression of the keyword with wordboundaries.
 */
var toRegex = function( keyword ) {
	keyword = addWordBoundary( keyword );
	return new RegExp( keyword, "ig" );
};

/**
 * Matches a string with and without transliteration.
 * @param {string} text The text to match.
 * @param {string} keyword The keyword to match in the text.
 * @param {string} locale The locale used for transliteration.
 * @returns {Array} All matches from the original as the transliterated text and keyword.
 */
module.exports = function( text, keyword, locale ) {
	var keywordRegex = toRegex( keyword );
	var matches = text.match( keywordRegex ) || [];

	text = text.replace( keywordRegex, "" );

	var transliterateKeyword = transliterate( keyword, locale );
	var transliterateKeywordRegex = toRegex( transliterateKeyword );
	var transliterateMatches = text.match( transliterateKeywordRegex ) || [];

	var combinedArray = matches.concat( transliterateMatches );
	return map( combinedArray, function( keyword ) {
		return stripSpaces( keyword );
	} );
};

},{"./isObject":494,"./now":505,"./toNumber":510}],478:[function(require,module,exports){
arguments[4][284][0].apply(exports,arguments)
},{"./_apply":367,"./_assignInDefaults":373,"./assignInWith":475,"./rest":507,"dup":284}],479:[function(require,module,exports){
arguments[4][285][0].apply(exports,arguments)
},{"./_apply":367,"./_mergeDefaults":460,"./mergeWith":504,"./rest":507,"dup":285}],480:[function(require,module,exports){
arguments[4][287][0].apply(exports,arguments)
},{"dup":287}],481:[function(require,module,exports){
arguments[4][292][0].apply(exports,arguments)
},{"./_arrayEach":368,"./_baseEach":380,"./_baseIteratee":390,"./isArray":487,"dup":292}],482:[function(require,module,exports){
arguments[4][293][0].apply(exports,arguments)
},{"./_baseGet":383,"dup":293}],483:[function(require,module,exports){
var baseHas = require('./_baseHas'),
    hasPath = require('./_hasPath');

/**
 * Returns the number of matches in a given string
 *
 * @param {string} text The text to use for matching the wordToMatch.
 * @param {string} wordToMatch The word to match in the text
 * @param {string} locale The locale used for transliteration.
 * @param {string} [extraBoundary] An extra string that can be added to the wordboundary regex
 * @returns {number} The amount of matches found.
 */
module.exports = function( text, wordToMatch, locale, extraBoundary ) {
	text = stripSomeTags( text );
	text = unifyWhitespace( text );
	var matches = matchStringWithTransliteration( text, wordToMatch, locale, extraBoundary );
	return matches.length;
};

},{"../stringProcessing/matchTextWithTransliteration.js":345,"../stringProcessing/stripNonTextTags.js":354,"../stringProcessing/unifyWhitespace.js":359}],347:[function(require,module,exports){
/** @module stringProcessing/removeNonWordCharacters.js */

/**
 * Removes all spaces and nonwordcharacters from a string.
 *
 * @param {string} string The string to replace spaces from.
 * @returns {string} string The string without spaces.
 */
module.exports = function( string ) {
	return string.replace( /[\s\n\r\t\.,'\(\)\"\+;!?:\/]/g, "" );
};

},{}],348:[function(require,module,exports){
/** @module stringProcessing/replaceDiacritics */

var diacriticsRemovalMap = require( "../config/diacritics.js" );

},{"./_baseHas":385,"./_hasPath":430}],484:[function(require,module,exports){
arguments[4][294][0].apply(exports,arguments)
},{"./_baseHasIn":386,"./_hasPath":430,"dup":294}],485:[function(require,module,exports){
/**
 * Replaces all diacritics from the text based on the diacritics removal map.
 *
 * @param {string} text The text to remove diacritics from.
 * @returns {string} The text with all diacritics replaced.
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],486:[function(require,module,exports){
arguments[4][298][0].apply(exports,arguments)
},{"./isArrayLikeObject":489,"dup":298}],487:[function(require,module,exports){
arguments[4][299][0].apply(exports,arguments)
},{"dup":299}],488:[function(require,module,exports){
arguments[4][300][0].apply(exports,arguments)
},{"./_getLength":423,"./isFunction":491,"./isLength":492,"dup":300}],489:[function(require,module,exports){
arguments[4][301][0].apply(exports,arguments)
},{"./isArrayLike":488,"./isObjectLike":495,"dup":301}],490:[function(require,module,exports){
var constant = require('./constant'),
    root = require('./_root');

	for ( var i = 0; i < map.length; i++ ) {
		text = text.replace(
			map[ i ].letters,
			map[ i ].base
		);
	}
	return text;
};

},{"../config/diacritics.js":264}],349:[function(require,module,exports){
/** @module stringProcessing/replaceString */

/**
 * Replaces string with a replacement in text
 *
 * @param {string} text The textstring to remove
 * @param {string} stringToReplace The string to replace
 * @param {string} replacement The replacement of the string
 * @returns {string} The text with the string replaced
 */
module.exports = function( text, stringToReplace, replacement ) {
	text = text.replace( stringToReplace, replacement );

	return text;
};

},{}],350:[function(require,module,exports){
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
	text = text.replace( /[\[\]\{\}\(\)\*\+\?\^\$\|]/g, "" );
	text = stripTags( text );
	text = stripSpaces( text );

	return text;
};

},{"./_root":462,"./constant":476}],491:[function(require,module,exports){
arguments[4][305][0].apply(exports,arguments)
},{"./isObject":494,"dup":305}],492:[function(require,module,exports){
arguments[4][306][0].apply(exports,arguments)
},{"dup":306}],493:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isHostObject = require('./_isHostObject'),
    isObject = require('./isObject'),
    toSource = require('./_toSource');

/**
 * Returns an array with the number of words in a sentence.
 * @param {Array} sentences Array with sentences from text.
 * @returns {Array} Array with amount of words in each sentence.
 */
module.exports = function( sentences ) {
	var sentencesWordCount = [];
	forEach( sentences, function( sentence ) {

		// For counting words we want to omit the HTMLtags.
		var strippedSentence = stripHTMLTags( sentence );
		var length = wordCount( strippedSentence );

		if ( length <= 0 ) {
			return;
		}

		sentencesWordCount.push( {
			sentence: sentence,
			sentenceLength: wordCount( sentence )
		} );
	} );
	return sentencesWordCount;
};

},{"./countWords.js":331,"./stripHTMLTags.js":353,"lodash/forEach":176}],352:[function(require,module,exports){
/** @module stringProcessing/stringToRegex */
var isUndefined = require( "lodash/isUndefined" );
var replaceDiacritics = require( "../stringProcessing/replaceDiacritics.js" );
var sanitizeString = require( "../stringProcessing/sanitizeString.js" );
var addWordBoundary = require( "../stringProcessing/addWordboundary.js" );

/**
 * Creates a regex from a string so it can be matched everywhere in the same way.
 *
 * @param {string} string The string to make a regex from.
 * @param {string} [extraBoundary=""] A string that is used as extra boundary for the regex.
 * @param {boolean} [doReplaceDiacritics=true] If set to false, it doesn't replace diacritics. Defaults to true.
 * @returns {RegExp} regex The regex made from the keyword
 */
module.exports = function( string, extraBoundary, doReplaceDiacritics ) {
	if ( isUndefined( extraBoundary ) ) {
		extraBoundary = "";
	}

	if ( isUndefined( doReplaceDiacritics ) || doReplaceDiacritics === true ) {
		string = replaceDiacritics( string );
	}

	string = sanitizeString( string );
	string = addWordBoundary( string, extraBoundary );
	return new RegExp( string, "ig" );
};

},{"../stringProcessing/addWordboundary.js":326,"../stringProcessing/replaceDiacritics.js":348,"../stringProcessing/sanitizeString.js":350,"lodash/isUndefined":200}],353:[function(require,module,exports){
/** @module stringProcessing/stripHTMLTags */

var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

module.exports = isNative;

},{"./_isHostObject":440,"./_toSource":474,"./isFunction":491,"./isObject":494}],494:[function(require,module,exports){
arguments[4][309][0].apply(exports,arguments)
},{"dup":309}],495:[function(require,module,exports){
arguments[4][310][0].apply(exports,arguments)
},{"dup":310}],496:[function(require,module,exports){
arguments[4][311][0].apply(exports,arguments)
},{"./_getPrototype":427,"./_isHostObject":440,"./isObjectLike":495,"dup":311}],497:[function(require,module,exports){
arguments[4][312][0].apply(exports,arguments)
},{"./isArray":487,"./isObjectLike":495,"dup":312}],498:[function(require,module,exports){
arguments[4][313][0].apply(exports,arguments)
},{"./isObjectLike":495,"dup":313}],499:[function(require,module,exports){
arguments[4][314][0].apply(exports,arguments)
},{"./isLength":492,"./isObjectLike":495,"dup":314}],500:[function(require,module,exports){
arguments[4][315][0].apply(exports,arguments)
},{"dup":315}],501:[function(require,module,exports){
arguments[4][316][0].apply(exports,arguments)
},{"./_baseHas":385,"./_baseKeys":391,"./_indexKeys":436,"./_isIndex":441,"./_isPrototype":445,"./isArrayLike":488,"dup":316}],502:[function(require,module,exports){
arguments[4][317][0].apply(exports,arguments)
},{"./_baseKeysIn":392,"./_indexKeys":436,"./_isIndex":441,"./_isPrototype":445,"dup":317}],503:[function(require,module,exports){
arguments[4][319][0].apply(exports,arguments)
},{"./_MapCache":356,"dup":319}],504:[function(require,module,exports){
arguments[4][321][0].apply(exports,arguments)
},{"./_baseMerge":395,"./_createAssigner":415,"dup":321}],505:[function(require,module,exports){
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

},{"../stringProcessing/stripSpaces.js":356}],354:[function(require,module,exports){
/** @module stringProcessing/stripNonTextTags */

},{}],506:[function(require,module,exports){
arguments[4][325][0].apply(exports,arguments)
},{"./_baseProperty":397,"./_basePropertyDeep":398,"./_isKey":443,"./_toKey":473,"dup":325}],507:[function(require,module,exports){
arguments[4][327][0].apply(exports,arguments)
},{"./_apply":367,"./toInteger":509,"dup":327}],508:[function(require,module,exports){
arguments[4][331][0].apply(exports,arguments)
},{"./toNumber":510,"dup":331}],509:[function(require,module,exports){
var toFinite = require('./toFinite');

/**
 * Strips all tags from the text, except li, p, dd and h1-h6 tags from the text that contain content to check.
 *
 * @param {string} text The text to strip tags from
 * @returns {string} The text stripped of tags, except for li, p, dd and h1-h6 tags.
 */
module.exports = function( text ) {
	text = text.replace( /<(?!li|\/li|p|\/p|h1|\/h1|h2|\/h2|h3|\/h3|h4|\/h4|h5|\/h5|h6|\/h6|dd).*?\>/g, "" );
	text = stripSpaces( text );
	return text;
};

},{"../stringProcessing/stripSpaces.js":356}],355:[function(require,module,exports){
/** @module stringProcessing/stripNumbers */

var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

/**
 * Removes all words comprised only of numbers.
 *
 * @param {string} text to remove words
 * @returns {string} The text with numberonly words removed.
 */

module.exports = function( text ) {

	// Remove "words" comprised only of numbers
	text = text.replace( /\b[0-9]+\b/g, "" );

	text = stripSpaces( text );

	if ( text === "." ) {
		text = "";
	}
	return text;
};

},{"./toFinite":508}],510:[function(require,module,exports){
arguments[4][333][0].apply(exports,arguments)
},{"./isFunction":491,"./isObject":494,"./isSymbol":498,"dup":333}],511:[function(require,module,exports){
var createToPairs = require('./_createToPairs'),
    keys = require('./keys');

/**
 * Strip double spaces from text
 *
 * @param {String} text The text to strip spaces from.
 * @returns {String} The text without double spaces
 */
module.exports = function( text ) {

	// Replace multiple spaces with single space
	text = text.replace( /\s{2,}/g, " " );

},{"./_createToPairs":418,"./keys":501}],512:[function(require,module,exports){
arguments[4][334][0].apply(exports,arguments)
},{"./_copyObject":413,"./keysIn":502,"dup":334}],513:[function(require,module,exports){
arguments[4][335][0].apply(exports,arguments)
},{"./_baseToString":401,"dup":335}],514:[function(require,module,exports){
// shim for using process in browser

	// Remove first/last character if space
	text = text.replace( /^\s+|\s+$/g, "" );

	return text;
};

},{}],357:[function(require,module,exports){
var replaceString = require( "../stringProcessing/replaceString.js" );
var removalWords = require( "../config/removalWords.js" )();
var matchTextWithTransliteration = require( "../stringProcessing/matchTextWithTransliteration.js" );

/**
 * Matches the keyword in an array of strings
 *
 * @param {Array} matches The array with the matched headings.
 * @param {String} keyword The keyword to match
 * @param {string} locale The locale used for transliteration.
 * @returns {number} The number of occurrences of the keyword in the headings.
 */
module.exports = function( matches, keyword, locale ) {
	var foundInHeader;
	if ( matches === null ) {
		foundInHeader = -1;
	} else {
		foundInHeader = 0;
		for ( var i = 0; i < matches.length; i++ ) {

			// TODO: This replaceString call seemingly doesn't work, as no replacement value is being sent to the .replace method in replaceString
			var formattedHeaders = replaceString(
				matches[ i ], removalWords
			);
			if (
				matchTextWithTransliteration( formattedHeaders, keyword, locale ).length > 0 ||
				matchTextWithTransliteration( matches[ i ], keyword, locale ).length > 0
			) {
				foundInHeader++;
			}
		}
	}
	return foundInHeader;
};

},{"../config/removalWords.js":266,"../stringProcessing/matchTextWithTransliteration.js":345,"../stringProcessing/replaceString.js":349}],358:[function(require,module,exports){
/** @module stringProcessing/replaceDiacritics */

var transliterationsMap = require( "../config/transliterations.js" );

/**
 * Replaces all special characters from the text based on the transliterations map.
 *
 * @param {string} text The text to remove special characters from.
 * @param {string} locale The locale.
 * @returns {string} The text with all special characters replaced.
 */
module.exports = function( text, locale ) {
	var map = transliterationsMap( locale );
	for ( var i = 0; i < map.length; i++ ) {
		text = text.replace(
			map[ i ].letter,
			map[ i ].alternative
		);
	}
	return text;
};

},{"../config/transliterations.js":270}],359:[function(require,module,exports){
/** @module stringProcessing/unifyWhitespace */

/**
 * Converts all whitespace to spaces.
 *
 * @param {string} text The text to replace spaces.
 * @returns {string} The text with unified spaces.
 */

module.exports = function( text ) {

	// Replace &nbsp with space
	text = text.replace( "&nbsp;", " " );

	// Replace whitespaces with space
	text = text.replace( /\s/g, " " );

	return text;
};

},{}],515:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],516:[function(require,module,exports){
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

},{}],360:[function(require,module,exports){
(function (global){
;(function() {
  var undefined;

  var objectTypes = {
    'function': true,
    'object': true
  };

  var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
    ? exports
    : undefined;

  var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
    ? module
    : undefined;

  var moduleExports = (freeModule && freeModule.exports === freeExports)
    ? freeExports
    : undefined;

  var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);

  var freeSelf = checkGlobal(objectTypes[typeof self] && self);

  var freeWindow = checkGlobal(objectTypes[typeof window] && window);

  var thisGlobal = checkGlobal(objectTypes[typeof this] && this);

  var root = freeGlobal ||
    ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
      freeSelf || thisGlobal || Function('return this')();

  function checkGlobal(value) {
    return (value && value.Object === Object) ? value : null;
  }

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '4.12.0';

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;

  /** `Object#toString` result references. */
  var symbolTag = '[object Symbol]';

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

  /*--------------------------------------------------------------------------*/

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

  /*--------------------------------------------------------------------------*/

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objectToString = objectProto.toString;

  /** Built-in value references. */
  var Symbol = root.Symbol;

  /** Used to lookup unminified function names. */
  var realNames = {};

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = Symbol ? Symbol.prototype : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;

  /*------------------------------------------------------------------------*/

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
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
  }

  /*------------------------------------------------------------------------*/

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

  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
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
   * Converts the characters "&", "<", ">", '"', "'", and "\`" in `string` to
   * their corresponding HTML entities.
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
   * Backticks are escaped because in IE < 9, they can break out of
   * attribute values or HTML comments. See [#59](https://html5sec.org/#59),
   * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
   * [#133](https://html5sec.org/#133) of the
   * [HTML5 Security Cheatsheet](https://html5sec.org/) for more details.
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

  /*--------------------------------------------------------------------------*/

  var _ = { 'escape': escape };

  /*----------------------------------------------------------------------------*/

  var templates = {
    'assessmentPresenterResult': {},
    'hiddenSpan': {},
    'snippetEditor': {}
  };

  templates['assessmentPresenterResult'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {
    __p += '<ul class="wpseoanalysis assessment-results">\n    <button type="button" class="assessment-results__remove-marks js-assessment-results__remove-marks"><span class="screen-reader-text">' +
    ((__t = ( i18n.removeMarks )) == null ? '' : __t) +
    '</span></button>\n    ';
     for (var i in scores) {
    __p += '\n        <li class="score">\n            <span class="wpseo-score-icon ' +
    __e( scores[ i ].className ) +
    '"></span>\n            <span class="screen-reader-text">' +
    ((__t = ( scores[ i ].screenReaderText )) == null ? '' : __t) +
    '</span>\n            <span class="wpseo-score-text">' +
    ((__t = ( scores[ i ].text )) == null ? '' : __t) +
    '</span>\n            ';
     if ( scores[ i ].marker ) {
    __p += '\n            <button type="button" class="assessment-results__mark icon-eye-inactive js-assessment-results__mark-' +
    ((__t = ( scores[ i ].identifier )) == null ? '' : __t) +
    '"><span class="screen-reader-text">' +
    ((__t = ( i18n.markInText )) == null ? '' : __t) +
    '</span></button>\n            ';
     }
    __p += '\n        </li>\n    ';
     }
    __p += '\n</ul>\n';

    }
    return __p
  };

  templates['hiddenSpan'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {
    __p += '<span style="width: ' +
    __e( width ) +
    '; height: auto; position: absolute; visibility: hidden; ';
     if ( "" !== whiteSpace ) {
    __p += 'white-space: ' +
    __e(whiteSpace );
       }
    __p += '">\n\n</span>';

    }
    return __p
  };

  templates['snippetEditor'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {
    __p += '<div id="snippet_preview">\n    <section class="snippet-editor__preview">\n		<h3 class="snippet-editor__heading snippet-editor__heading-icon-eye">' +
    __e( i18n.snippetPreview ) +
    '</h3>\n    <p class="screen-reader-text">' +
    __e( i18n.snippetPreviewDescription ) +
    '</p>\n\n        <div class="snippet_container snippet-editor__container" id="title_container">\n            <span class="screen-reader-text">' +
    __e( i18n.titleLabel ) +
    '</span>\n            <span class="title" id="snippet_title">\n                ' +
    __e( rendered.title ) +
    '\n            </span>\n            <span class="title" id="snippet_sitename"></span>\n        </div>\n        <div class="snippet_container snippet-editor__container" id="url_container">\n            <span class="screen-reader-text">' +
    __e( i18n.slugLabel ) +
    '</span>\n            <cite class="url urlBase" id="snippet_citeBase">\n                ' +
    __e( rendered.baseUrl ) +
    '\n            </cite>\n            <cite class="url" id="snippet_cite">\n                ' +
    __e( rendered.snippetCite ) +
    '\n            </cite>\n        </div>\n        <div class="snippet_container snippet-editor__container" id="meta_container">\n            <span class="screen-reader-text">' +
    __e( i18n.metaDescriptionLabel ) +
    '</span>\n            ';
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
    '" />\n        </label>\n        <progress value="0.0" class="snippet-editor__progress snippet-editor__progress-title" aria-hidden="true">\n            <div class="snippet-editor__progress-bar"></div>\n        </progress>\n        <label for="snippet-editor-slug" class="snippet-editor__label">\n            ' +
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
    '</textarea>\n        </label>\n        <progress value="0.0" class="snippet-editor__progress snippet-editor__progress-meta-description" aria-hidden="true">\n            <div class="snippet-editor__progress-bar"></div>\n        </progress>\n\n        <button class="snippet-editor__submit snippet-editor__button" type="button">' +
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
    freeExports.templates = templates;
  }
  else {
    root.templates = templates;
  }
}.call(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],361:[function(require,module,exports){
var isUndefined = require( "lodash/isUndefined" );
var isNumber = require( "lodash/isNumber" );

/**
 * A function that only returns an empty that can be used as an empty marker
 *
 * @returns {Array} A list of empty marks.
 */
var emptyMarker = function() {
	return [];
};

/**
 * Construct the AssessmentResult value object.
 * @constructor
 */
var AssessmentResult = function() {
	this._hasScore = false;
	this._identifier = "";
	this._hasMarks = false;
	this._marker = emptyMarker;
	this.score = 0;
	this.text = "";
};

/**
 * Check if a score is available.
 * @returns {boolean} Whether or not a score is available.
 */
AssessmentResult.prototype.hasScore = function() {
	return this._hasScore;
};

/**
 * Get the available score
 * @returns {number} The score associated with the AssessmentResult.
 */
AssessmentResult.prototype.getScore = function() {
	return this.score;
};

/**
 * Set the score for the assessment.
 * @param {number} score The score to be used for the score property
 * @returns {void}
 */
AssessmentResult.prototype.setScore = function( score ) {
	if ( isNumber( score ) ) {
		this.score = score;
		this._hasScore = true;
	}
};

/**
 * Check if a text is available.
 * @returns {boolean} Whether or not a text is available.
 */
AssessmentResult.prototype.hasText = function() {
	return this.text !== "";
};

/**
 * Get the available text
 * @returns {string} The text associated with the AssessmentResult.
 */
AssessmentResult.prototype.getText = function() {
	return this.text;
};

/**
 * Set the text for the assessment.
 * @param {string} text The text to be used for the text property
 * @returns {void}
 */
AssessmentResult.prototype.setText = function( text ) {
	if ( isUndefined( text ) ) {
		text = "";
	}

	this.text = text;
};

/**
 * Sets the identifier
 *
 * @param {string} identifier An alphanumeric identifier for this result.
 */
AssessmentResult.prototype.setIdentifier = function( identifier ) {
	this._identifier = identifier;
};

/**
 * Gets the identifier
 *
 * @returns {string} An alphanumeric identifier for this result.
 */
AssessmentResult.prototype.getIdentifier = function() {
	return this._identifier;
};

/**
 * Sets the marker, a pure function that can return the marks for a given Paper
 *
 * @param {Function} marker The marker to set.
 */
AssessmentResult.prototype.setMarker = function( marker ) {
	this._marker = marker;
};

/**
 * Returns whether or not this result has a marker that can be used to mark for a given Paper
 *
 * @returns {boolean} Whether or this result has a marker.
 */
AssessmentResult.prototype.hasMarker = function() {
	return this._hasMarks && this._marker !== emptyMarker;
};

/**
 * Gets the marker, a pure function that an return the marks for a given Paper
 *
 * @returns {Function} The marker.
 */
AssessmentResult.prototype.getMarker = function() {
	return this._marker;
};

/**
 * Sets the value of _hasMarks to determine if there is something to mark.
 *
 * @param {boolean} hasMarks Is there something to mark.
 */
AssessmentResult.prototype.setHasMarks = function( hasMarks ) {
	this._hasMarks = hasMarks;
};

/**
 * Returns the value of _hasMarks to determine if there is something to mark.
 *
 * @returns {boolean} Is there something to mark.
 */
AssessmentResult.prototype.hasMarks = function() {
	return this._hasMarks;
};

module.exports = AssessmentResult;

},{"lodash/isNumber":193,"lodash/isUndefined":200}],362:[function(require,module,exports){
var defaults = require( "lodash/defaults" );

/**
 * Represents a marked piece of text
 *
 * @param {Object} properties The properties of this Mark.
 * @param {string} properties.original The original text that should be marked.
 * @param {string} properties.marked The new text including marks.
 * @constructor
 */
function Mark( properties ) {
	defaults( properties, { original: "", marked: "" } );

	this._properties = properties;
}


/**
 * Returns the original text
 *
 * @returns {string} The original text.
 */
Mark.prototype.getOriginal = function() {
	return this._properties.original;
};

/**
 * Returns the marked text
 *
 * @returns {string} The replaced text.
 */
Mark.prototype.getMarked = function() {
	return this._properties.marked;
};

/**
 * Applies this mark to the given text
 *
 * @param {string} text The original text without the mark applied.
 * @returns {string} The A new text with the mark applied to it.
 */
Mark.prototype.applyWithReplace = function( text ) {
	// Cute method to replace everything in a string without using regex.
	return text.split( this._properties.original ).join( this._properties.marked );
};

module.exports = Mark;

},{"lodash/defaults":169}],363:[function(require,module,exports){
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

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":515,"_process":514,"inherits":351}]},{},[349]);
