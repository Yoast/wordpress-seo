/* global YoastSEO */

var defaultsDeep = require( "lodash/defaultsDeep" );
import isUndefined from "lodash/isUndefined";

var KeywordTab = require( "./keywordTab" );
var GenericTab = require( "./genericTab" );
import { setActiveTab } from "../redux/actions/activeTab";

var $ = jQuery;

var defaultArguments = {
	strings: {
		keywordTab: "",
		contentTab: "",
	},
	focusKeywordField: "#yoast_wpseo_focuskw",
	contentAnalysisActive: "1",
};

/**
 * The tab manager is responsible for managing the analysis tabs in the metabox.
 *
 * @param {Object} args The arguments to use.
 *
 * @constructor
 */
function TabManager( args ) {
	args = args || {};

	defaultsDeep( args, defaultArguments );

	this.arguments = args;
	this.strings = args.strings;
}

/**
 * Initializes the two tabs.
 *
 * @returns {void}
 */
TabManager.prototype.init = function() {
	var metaboxTabsContainer = $( ".wpseo-metabox-tab-content" );

	// Remove default functionality to prevent scrolling to top.
	metaboxTabsContainer.on( "click", ".wpseo_tablink", function( ev ) {
		ev.preventDefault();
	} );

	this.focusKeywordRow = $( "#wpseofocuskeyword" );

	var initialKeyword   = $( this.arguments.focusKeywordField ).val();

	// Initialize an instance of the keyword tab.
	this.mainKeywordTab = new KeywordTab( {
		keyword: initialKeyword,
		prefix: this.strings.keywordTab,
		fallback: "",
		onActivate: function() {
			this.showKeywordAnalysis();
			this.contentTab.deactivate();
		}.bind( this ),
		afterActivate: function() {
			YoastSEO.app.refresh();
		},
	} );

	this.contentTab = new GenericTab( {
		label: this.strings.contentTab,
		onActivate: function() {
			this.showContentAnalysis();
			this.mainKeywordTab.deactivate();
		}.bind( this ),
		afterActivate: function() {
			YoastSEO.app.refresh();
		},
	} );

	if ( this.arguments.keywordAnalysisActive ) {
		this.mainKeywordTab.init( metaboxTabsContainer );
	}

	if ( this.arguments.contentAnalysisActive ) {
		this.contentTab.init( metaboxTabsContainer );
	}

	$( ".yoast-seo__remove-tab" ).remove();
};

/**
 * Shows the keyword analysis elements.
 *
 * @returns {void}
 */
TabManager.prototype.showKeywordAnalysis = function() {
	this.focusKeywordRow.show();

	if ( ! isUndefined( YoastSEO.store ) )
	{
		YoastSEO.store.dispatch( setActiveTab( "keyword" ) );
	}
};

/**
 * Shows the content analysis elements.
 *
 * @returns {void}
 */
TabManager.prototype.showContentAnalysis = function() {
	this.focusKeywordRow.hide();

	if ( ! isUndefined( YoastSEO.store ) )
	{
		YoastSEO.store.dispatch( setActiveTab( "readability" ) );
	}
};

/**
 * Updates the content tab with the calculated score
 *
 * @param {number} score The score that has been calculated.
 *
 * @returns {void}
 */
TabManager.prototype.updateContentTab = function( score ) {
	this.contentTab.updateScore( score );
};

/**
 * Updates the keyword tab with the calculated score
 *
 * @param {number} score The score that has been calculated.
 * @param {string} keyword The keyword that has been used to calculate the score.
 *
 * @returns {void}
 */
TabManager.prototype.updateKeywordTab = function( score, keyword ) {
	this.mainKeywordTab.updateScore( score, keyword );
};

/**
 * Returns whether or not the keyword is the main keyword
 *
 * @param {string} keyword The keyword to check
 *
 * @returns {boolean} True when keyword is the main keyword.
 */
TabManager.prototype.isMainKeyword = function( keyword ) {
	return this.mainKeywordTab.getKeywordFromElement() === keyword;
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
