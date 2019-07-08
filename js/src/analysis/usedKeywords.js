/* global jQuery, ajaxurl */

import has from "lodash/has";
import debounce from "lodash/debounce";
import isArray from "lodash/isArray";
import isEqual from "lodash/isEqual";

var $ = jQuery;

/**
 * Object that handles keeping track if the current keyword has been used before and retrieves this usage from the
 * server.
 *
 * @param {string}   ajaxAction            The ajax action to use when retrieving the used keywords data.
 * @param {Object}   options               The options for the used keywords assessment plugin.
 * @param {Object}   options.keyword_usage An object that contains the keyword usage when instantiating.
 * @param {Object}   options.search_url    The URL to link the user to if the keyword has been used multiple times.
 * @param {Object}   options.post_edit_url The URL to link the user to if the keyword has been used a single time.
 * @param {Function} refreshAnalysis       Function that triggers a refresh of the analysis.
 * @param {string}   scriptUrl             The URL to the used keywords assessment script.
 *
 * @returns {void}
 */
function UsedKeywords( ajaxAction, options, refreshAnalysis, scriptUrl ) {
	this._scriptUrl = scriptUrl;
	this._options = {
		usedKeywords: options.keyword_usage,
		searchUrl: options.search_url,
		postUrl: options.post_edit_url,
	};
	this._keywordUsage = options.keyword_usage;
	this._postID = $( "#post_ID, [name=tag_ID]" ).val();
	this._taxonomy = $( "[name=taxonomy]" ).val() || "";
	this._ajaxAction = ajaxAction;
	this._refreshAnalysis = refreshAnalysis;
	this._initialized = false;
}

/**
 * Initializes everything necessary for used keywords
 *
 * @returns {void}
 */
UsedKeywords.prototype.init = function() {
	const { worker } = window.YoastSEO.analysis;

	this.requestKeywordUsage = debounce( this.requestKeywordUsage.bind( this ), 500 );

	worker.loadScript( this._scriptUrl )
		.then( () => {
			worker.sendMessage( "initialize", this._options, "used-keywords-assessment" );
		} )
		.then( () => {
			this._initialized = true;

			if ( isEqual( this._options.usedKeywords, this._keywordUsage ) ) {
				this._refreshAnalysis();
				return;
			}

			worker.sendMessage( "updateKeywordUsage", this._keywordUsage, "used-keywords-assessment" )
				.then( () => this._refreshAnalysis() );
		} )
		.catch( error => console.error( error ) );
};

/**
 * Handles an event of the keyword input field
 *
 * @param {string} keyword The keyword to request the usage for.
 *
 * @returns {void}
 */
UsedKeywords.prototype.setKeyword = function( keyword ) {
	if ( ! has( this._keywordUsage, keyword ) ) {
		this.requestKeywordUsage( keyword );
	}
};

/**
 * Request keyword usage from the server
 *
 * @param {string} keyword The keyword to request the usage for.
 *
 * @returns {void}
 */
UsedKeywords.prototype.requestKeywordUsage = function( keyword ) {
	$.post( ajaxurl, {
		action: this._ajaxAction,
		/* eslint-disable-next-line camelcase */
		post_id: this._postID,
		keyword: keyword,
		taxonomy: this._taxonomy,
	}, this.updateKeywordUsage.bind( this, keyword ), "json" );
};

/**
 * Updates the keyword usage based on the response of the ajax request
 *
 * @param {string} keyword The keyword for which the usage was requested.
 * @param {*} response The response retrieved from the server.
 *
 * @returns {void}
 */
UsedKeywords.prototype.updateKeywordUsage = function( keyword, response ) {
	const { worker } = window.YoastSEO.analysis;

	if ( response && isArray( response ) ) {
		this._keywordUsage[ keyword ] = response;

		if ( this._initialized ) {
			worker.sendMessage( "updateKeywordUsage", this._keywordUsage, "used-keywords-assessment" )
				.then( () => this._refreshAnalysis() );
		}
	}
};

module.exports = UsedKeywords;
