/* global wp, wpseoPostScraperL10n, _, YoastSEO */

var scoreToRating = require( "yoastseo/js/interpreters/scoreToRating" );
var indicatorsFactory = require( "yoastseo/js/config/presenter" );
var Paper = require( "yoastseo/js/values/paper" );
var isContentAnalysisActive = require( "../../../../../js/src/analysis/isContentAnalysisActive" );
var isKeywordAnalysisActive = require( "../../../../../js/src/analysis/isKeywordAnalysisActive" );
var _isUndefined = require( "lodash/isUndefined" );

var indicators;

var maxKeywords = 5;
var keywordTabTemplate;

var tabManager;

var YoastMultiKeyword = function() {};

let $ = jQuery;

/**
 * Returns the index of the first keyword tab.
 *
 * @returns {number} The index of the keyword tab.
 */
function getFirstKeywordTabIndex() {
	// If there is no content tab the first keyword tab has a different index.
	return isContentAnalysisActive() ? 1 : 0;
}

/**
 * Initialized the dom.
 *
 * @returns {void}
 */
YoastMultiKeyword.prototype.initDOM = function() {
	if ( ! isKeywordAnalysisActive() ) {
		return;
	}

	tabManager = window.YoastSEO.wp._tabManager;

	window.YoastSEO.multiKeyword = true;
	keywordTabTemplate = wp.template( "keyword_tab" );

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
 *
 * @returns {void}
 */
YoastMultiKeyword.prototype.setTextInput = function() {
	$( "#yoast_wpseo_focuskw_text_input" ).val( $( "#yoast_wpseo_focuskw" ).val() );
};

/**
 * Retrieves the current keywords
 *
 * @returns {Object} All the keywords and their score.
 */
YoastMultiKeyword.prototype.getKeywords = function() {
	return $( ".wpseo_keyword_tab" ).map( function( i, keywordTab ) {
		keywordTab = $( keywordTab ).find( ".wpseo_tablink" );

		return {
			// Convert to string to prevent errors if the keyword is "null".
			keyword: keywordTab.data( "keyword" ) + "",
			score: keywordTab.data( "score" ),
		};
	} ).get();
};

/**
 * Update keyword tabs and saves this information to the hidden field.
 *
 * @param {number} score The score calculated by the analyzer for the current tab.
 *
 * @returns {void}
 */
YoastMultiKeyword.prototype.updateKeywords = function( score ) {
	var firstKeyword, keywords;

	this.updateActiveKeywordTab( score );
	this.updateInactiveKeywords();
	this.updateOverallScore();

	keywords = this.getKeywords();

	// Exclude empty keywords.
	keywords = _.filter( keywords, function( item ) {
		return item.keyword.length > 0;
	} );

	if ( 0 === keywords.length ) {
		keywords.push( { keyword: "", score: 0 } );
	}

	if ( keywords.length > 0 ) {
		firstKeyword = keywords.splice( 0, 1 ).shift();

		$( "#yoast_wpseo_focuskw" ).val( firstKeyword.keyword );
	}

	// Save keyword information to the hidden field.
	$( "#yoast_wpseo_focuskeywords" ).val( JSON.stringify( keywords ) );
};

/**
 * Inserts multi keyword elements into the DOM
 *
 * @returns {void}
 */
YoastMultiKeyword.prototype.insertElements = function() {
	this.addKeywordTabs();
};

/**
 * Adds an event handler when the score updates
 *
 * @returns {void}
 */
YoastMultiKeyword.prototype.bindScore = function() {
	$( window ).on( "YoastSEO:numericScore", this.handleUpdatedScore.bind( this ) );
};

/**
 * Handles an update of the score thrown by the post scraper.
 *
 * @param {jQuery.Event} ev    The event triggered.
 * @param {number}       score The scores calculated by the analyzer.
 *
 * @returns {void}
 */
YoastMultiKeyword.prototype.handleUpdatedScore = function( ev, score ) {
	this.updateKeywords( score );
};

/**
 * Adds event handler to keyword tabs to change current keyword
 *
 * @returns {void}
 */
YoastMultiKeyword.prototype.bindKeywordTab = function() {
	$( ".wpseo-metabox-tabs" ).on( "click", ".wpseo_keyword_tab > .wpseo_tablink", function() {
		var $this = $( this );

		// Convert to string to prevent errors if the keyword is "null".
		var keyword = $this.data( "keyword" ) + "";
		$( "#yoast_wpseo_focuskw_text_input" ).val( keyword ).focus();

		tabManager.showKeywordAnalysis();

		// Because deactive removes all 'active' classes from all tabs we need to re-add the active class ourselves.
		tabManager.getContentTab().deactivate();

		$this.closest( ".wpseo_keyword_tab" ).addClass( "active" );

		YoastSEO.app.refresh();
	} );
};

/**
 * Adds event handler to tab removal links
 *
 * @returns {void}
 */
YoastMultiKeyword.prototype.bindKeywordRemove = function() {
	$( ".wpseo-metabox-tabs" ).on( "click", ".remove-keyword", function( ev ) {
		var previousTab, currentTab;

		currentTab = $( ev.currentTarget ).parent( "li" );
		previousTab = currentTab.prev();
		currentTab.remove();

		// If the removed tab was active we should make a different one active.
		if ( currentTab.hasClass( "active" ) ) {
			previousTab.find( ".wpseo_tablink" ).click();
		}

		this.updateUI();
	}.bind( this ) );
};

/**
 * Adds event handler to updates of the keyword field
 *
 * @returns {void}
 */
YoastMultiKeyword.prototype.bindKeywordField = function() {
	$( "#yoast_wpseo_focuskw_text_input" ).on( "input", function( ev ) {
		var currentTabLink, focusKeyword;

		focusKeyword = $( ev.currentTarget ).val();
		currentTabLink = $( "li.active > .wpseo_tablink" );
		currentTabLink.data( "keyword", focusKeyword );
		currentTabLink.find( "span.wpseo_keyword" ).text( focusKeyword || wpseoPostScraperL10n.enterFocusKeyword );
	} );
};

/**
 * Adds event handler to the keyword add button
 *
 * @returns {void}
 */
YoastMultiKeyword.prototype.bindKeywordAdd = function() {
	$( ".wpseo-add-keyword" ).click( function() {
		if ( ! this.canAddTab() ) {
			return;
		}

		this.addKeywordTab( null, "na", true );
	}.bind( this ) );
};

/**
 * Adds keyword tabs to the DOM
 *
 * @returns {void}
 */
YoastMultiKeyword.prototype.addKeywordTabs = function() {
	var keywords = JSON.parse( $( "#yoast_wpseo_focuskeywords" ).val() || "[]" );

	keywords.unshift( {
		keyword: $( "#yoast_wpseo_focuskw" ).val(),
		score: $( "#yoast_wpseo_linkdex" ).val(),
	} );

	// Clear the keyword tabs container.
	$( ".wpseo-metabox-tab-content" ).find( ".wpseo_keyword_tab" ).remove();

	if ( keywords.length > 0 ) {
		keywords.forEach( function( keywordObject, index ) {
			this.addKeywordTab( keywordObject.keyword, keywordObject.score, index === 0 );
		}.bind( this ) );
	}
};

/**
 * Adds a single keyword to the DOM
 *
 * @param {string} keyword The keyword for this tab.
 * @param {string} score The score class for this tab.
 * @param {boolean} focus Whether this tab should be currently focused.
 *
 * @returns {Object} A reference to the tab that has been added.
 */
YoastMultiKeyword.prototype.addKeywordTab = function( keyword, score, focus ) {
	var label, html, templateArgs;

	// Insert a new keyword tab.
	keyword = keyword || "";
	label = keyword.length > 0 ? keyword : wpseoPostScraperL10n.enterFocusKeyword;

	templateArgs = {
		keyword: keyword,
		label: label,
		removeLabel: wpseoPostScraperL10n.removeKeyword,
		score: score,
		isKeywordTab: true,
		classes: "wpseo_tab wpseo_keyword_tab wpseo_keyword_tab_hideable",
		hideable: true,
	};

	if ( 0 === $( ".wpseo_keyword_tab" ).length ) {
		templateArgs.hideable = false;
		templateArgs.classes = "wpseo_tab wpseo_keyword_tab";
	}

	html = keywordTabTemplate( templateArgs );

	$( ".wpseo-tab-add-keyword" ).before( html );

	this.updateUI();

	// Open the newly created tab.
	if ( focus === true ) {
		$( ".wpseo_keyword_tab:last > .wpseo_tablink" ).click();
	}

	return $( ".wpseo_keyword_tab:last" );
};

/**
 * Updates UI based on the current state.
 *
 * @returns {void}
 */
YoastMultiKeyword.prototype.updateUI = function() {
	var $addKeywordButton = $( ".wpseo-add-keyword" );

	if ( this.canAddTab() ) {
		$addKeywordButton
			.prop( "disabled", false )
			.attr( "aria-disabled", "false" );
	} else {
		$addKeywordButton
			.prop( "disabled", true )
			.attr( "aria-disabled", "true" );
	}

	$( this ).trigger( "changedCurrentKeywords" );
};

/**
 * Updates active keyword tab
 *
 * @param {number} score Score as returned by the analyzer.
 *
 * @returns {void}
 */
YoastMultiKeyword.prototype.updateActiveKeywordTab = function( score ) {
	var keyword, tab;

	tab     = $( ".wpseo_keyword_tab.active" );
	keyword = $( "#yoast_wpseo_focuskw_text_input" ).val();

	let firstKeywordTabIndex = getFirstKeywordTabIndex();

	if ( firstKeywordTabIndex === tab.index() ) {
		$( "#yoast_wpseo_linkdex" ).val( score );
	}

	this.renderKeywordTab( keyword, score, tab, true );
};

/**
 * Updates all keywords tabs that are currently inactive.
 *
 * @returns {void}
 */
YoastMultiKeyword.prototype.updateInactiveKeywords = _.debounce( function() {
	var inactiveKeywords;

	inactiveKeywords = $( ".wpseo_keyword_tab:not( .active )" );

	inactiveKeywords.each( function( i, tab ) {
		this.updateKeywordTab( tab );
	}.bind( this ) );
}, 300 );

/**
 * Update one keyword tab.
 *
 * @param {Object} tab The tab to update.
 *
 * @returns {void}
 */
YoastMultiKeyword.prototype.updateKeywordTab = function( tab ) {
	var keyword, link, score;

	tab = $( tab );

	link    = tab.find( ".wpseo_tablink" );
	keyword = link.data( "keyword" ) + "";
	score   = this.analyzeKeyword( keyword );

	this.renderKeywordTab( keyword, score, tab );
};

/**
 * Retrieves the indicators for a certain score and keyword
 *
 * @param {number} score   The score.
 * @param {string} keyword The keyword for this score.
 *
 * @returns {string} The indicator for the given score.
 */
YoastMultiKeyword.prototype.getIndicator = function( score, keyword ) {
	var rating;

	score /= 10;

	rating = scoreToRating( score );

	if ( "" === keyword ) {
		rating = "feedback";
		indicators[ rating ].screenReaderText = "";
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
	var html, templateArgs, label;

	tabElement = $( tabElement );

	label = keyword.length > 0 ? keyword : wpseoPostScraperL10n.enterFocusKeyword;

	var indicators = this.getIndicator( score, keyword );

	templateArgs = {
		keyword: keyword,
		label: label,
		removeLabel: wpseoPostScraperL10n.removeKeyword,
		score: indicators.className,
		scoreText: indicators.screenReaderText,
		isKeywordTab: true,
		classes: "wpseo_tab wpseo_keyword_tab wpseo_keyword_tab_hideable",
		hideable: true,
	};

	let firstKeywordTabIndex = getFirstKeywordTabIndex();

	// The first keyword tab isn't deletable, this first keyword tab is the second tab because of the content tab.
	if ( firstKeywordTabIndex === tabElement.index() ) {
		templateArgs.hideable = false;
		templateArgs.classes = "wpseo_tab wpseo_keyword_tab";
	}

	if ( true === active ) {
		templateArgs.active = true;
	}

	html = keywordTabTemplate( templateArgs );

	tabElement.replaceWith( html );
};

/**
 * Analyzes a certain keyword with an ad-hoc analyzer
 *
 * @param {string} keyword The keyword to analyze.
 *
 * @returns {number} Total score.
 */
YoastMultiKeyword.prototype.analyzeKeyword = function( keyword ) {
	var paper;
	var assessor = YoastSEO.app.seoAssessor;
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
		locale: currentPaper.getLocale(),
	} );

	assessor.assess( paper );

	return assessor.calculateOverallScore();
};

/**
 * Makes sure the overall score is always correct even if we switch to different tabs.
 *
 * @returns {void}
 */
YoastMultiKeyword.prototype.updateOverallScore = function() {
	var score;
	var mainKeywordField, currentKeywordField;

	mainKeywordField = $( "#yoast_wpseo_focuskw" );
	currentKeywordField = $( "#yoast_wpseo_focuskw_text_input" );

	if ( mainKeywordField.val() !== currentKeywordField.val() ) {
		score = $( "#yoast_wpseo_linkdex" ).val();
		score = parseInt( score, 10 );

		score = indicators[ scoreToRating( score ) ];
		score = score.className;

		if ( "" === mainKeywordField.val() ) {
			score = "na";
		}

		$( ".overallScore" )
			.removeClass( "na bad ok good" )
			.addClass( score );
	}
};

/**
 * Returns whether or not a new tab can be added
 *
 * @returns {boolean} True when a new tab can be added.
 */
YoastMultiKeyword.prototype.canAddTab = function() {
	var tabAmount;

	tabAmount = $( ".wpseo_keyword_tab" ).length;

	return tabAmount < maxKeywords;
};

export default YoastMultiKeyword;
