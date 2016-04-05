/* global jQuery, ajaxurl */

var UsedKeywordsPlugin = require( 'yoastseo' ).bundledPlugins.usedKeywords;
var _has = require( 'lodash/has' );
var _debounce = require( 'lodash/debounce' );
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
		searchUrl: '<a target="_blank" href=' + options.search_url + '>',
		postUrl: '<a target="_blank" href=' + options.post_edit_url + '>'
	}, app.i18n );

	this._postID = $( '#post_ID' ).val();
	this._ajaxAction = ajaxAction;
	this._app = app;
}

/**
 * Initializes everything necessary for used keywords
 */
UsedKeywords.prototype.init = function() {
	var eventHandler = _debounce( this.keywordChangeHandler.bind( this ), 500 );

	this._plugin.registerPlugin();
	this._focusKeywordElement.on( 'keyup', eventHandler );
};

/**
 * Handles an event of the keyword input field
 */
UsedKeywords.prototype.keywordChangeHandler = function() {
	var keyword = this._focusKeywordElement.val();

	if ( ! _has( this._keywordUsage, keyword ) ) {
		this.requestKeywordUsage( keyword );
	}
};

/**
 * Request keyword usage from the server
 *
 * @param {string} keyword The keyword to request the usage for.
 */
UsedKeywords.prototype.requestKeywordUsage = function( keyword ) {
	$.post( ajaxurl, {
		action: this._ajaxAction,
		post_id: this._postID,
		keyword: keyword
	}, this.updateKeywordUsage.bind( this, keyword ), 'json' );
};

/**
 * Updates the keyword usage based on the response of the ajax request
 *
 * @param {string} keyword The keyword for which the usage was requested.
 * @param {*} response The response retrieved from the server.
 */
UsedKeywords.prototype.updateKeywordUsage = function( keyword, response ) {
	if ( response ) {
		this._keywordUsage[ keyword ] = response;

		this._plugin.updateKeywordUsage( this._keywordUsage );
		this._app.analyzeTimer();
	}
};

module.exports = UsedKeywords;
