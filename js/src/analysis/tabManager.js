var defaultsDeep = require( 'lodash/defaultsDeep' );

var getIndicatorForScore = require( './getIndicatorForScore' );
var KeywordTab = require( './keywordTab' );

var $ = jQuery;

var defaultArguments = {
	strings: {
		keywordTab: '',
		contentTab: ''
	},
	focusKeywordField: '#yoast_wpseo_focuskw',
	contentAnalysisActive: '1'
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

	// Initialize an instance of the keyword tab.
	this.mainKeywordTab = new KeywordTab(
		{
			keyword: initialKeyword,
			prefix: this.strings.keywordTab,
			fallback: this.strings.enterFocusKeyword,
			onActivate: function() {
				this.showKeywordAnalysis();
				this.deactivateContentTab();

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
		showKeyword: false,
		isKeywordTab: false,
		onActivate: function() {
			this.showContentAnalysis();

			this.mainKeywordTab.active = false;
		}.bind( this ),
		afterActivate: function() {
			YoastSEO.app.refresh();
		}
	} );

	if ( this.arguments.contentAnalysisActive === '1' ) {
		this.contentTab.init( metaboxTabs, 'prepend' );
	}

	$( '.yoast-seo__remove-tab' ).remove();
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

	if ( keyword !== '' ) {
		indicator = getIndicatorForScore( score );
	}

	this.mainKeywordTab.update( indicator.className, indicator.screenReaderText, keyword );
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
