/* global YoastSEO */

import isEqual from "lodash/isEqual";
import forEach from "lodash/forEach";
import includes from "lodash/includes";

class linkSuggester {

	/**
	 * Handles the LinkSuggestions
	 *
	 * @param {string} rootUrl The root URL to do AJAX requests to.
	 * @param {string} nonce The nonce to use when sending requests to the REST API.
	 * @param {number} currentPostId The post ID of the post we are currently displaying.
	 */
	constructor( { rootUrl, nonce, currentPostId, showUnindexedWarning, store } ) {
		this._rootUrl = rootUrl;
		this._nonce = nonce;
		this._currentPostId = currentPostId;
		this.showUnindexedWarning = showUnindexedWarning;
		this.store = store;

		this.linkSuggestions = [];
		this._previousProminentWords = false;
		this.filterCurrentPost = this.filterCurrentPost.bind( this );

		jQuery( window ).on( "YoastSEO:numericScore", this.updateUsedLinks.bind( this ) );
	}

	/**
	 * Get the current link suggestions.
	 *
	 * @param {Array} currentLinkSuggestions The link suggestions currently known on the server.
	 * @returns {void}
	 */
	setCurrentLinkSuggestions( currentLinkSuggestions ) {
		if ( currentLinkSuggestions === false ) {
			return;
		}

		this.updateStore( currentLinkSuggestions );
	}

	/**
	 * Callback which handles changed prominent words, makes sure they are actually changed.
	 * If so, retrieve new link suggestions.
	 *
	 * @param {number[]} prominentWords The new prominent words IDs.
	 * @returns {void}
	 */
	updatedProminentWords( prominentWords ) {
		if ( ! isEqual( this._previousProminentWords, prominentWords ) ) {
			this._previousProminentWords = prominentWords;

			this.retrieveLinkSuggestions( prominentWords )
				.then( this.updateStore.bind( this ) )
				.catch( this.store.setLinkSuggestionsError );
		}
	}

	/**
	 * Updates the used links so they can be marked when rendering.
	 *
	 * @returns {void}
	 */
	updateUsedLinks() {
		this.usedLinks = YoastSEO.app.researcher.getResearch( "getLinks" );
		this.updateStore( this.linkSuggestions );
	}

	/**
	 * Retrieves link suggestions based on prominent words using AJAX.
	 *
	 * @param {number[]} prominentWords The prominent word IDs to retrieve link suggestions for.
	 * @returns {Promise} Resolves with the response from the server.
	 */
	retrieveLinkSuggestions( prominentWords ) {
		// An empty array doesn't require a server request.
		if ( isEqual( [], prominentWords ) ) {
			return Promise.resolve( [] );
		}

		return new Promise( ( resolve, reject ) => {
			let data = {
				// eslint-disable-next-line camelcase
				prominent_words: prominentWords,
			};

			jQuery.ajax( {
				type: "GET",
				url: this._rootUrl + "yoast/v1/link_suggestions?" + jQuery.param( data ),
				beforeSend: ( xhr ) => {
					xhr.setRequestHeader( "X-WP-Nonce", this._nonce );
				},
				dataType: "json",
				success: function( response ) {
					resolve( response );
				},
				error: function( response ) {
					reject( response );
				},
			} );
		} );
	}

	/**
	 * The component excepts different keys than we get from the API, so map to the component's expectation.
	 *
	 * @param {Array} linkSuggestions Current link suggestions.
	 * @returns {Array} The map link suggestions.
	 */
	static mapSuggestionsForStore( linkSuggestions ) {
		return linkSuggestions.map( ( linkSuggestion ) => {
			return {
				value: linkSuggestion.title,
				url: linkSuggestion.link,
				isActive: linkSuggestion.active,
				isCornerstone: linkSuggestion.isCornerstone,
			};
		} );
	}

	/**
	 * Removes the current post from the link suggestions.
	 *
	 * @param {Array} linkSuggestions The current link suggestions.
	 * @returns {Array} The link suggestions without the current post.
	 */
	filterCurrentPost( linkSuggestions ) {
		return linkSuggestions.filter( ( linkSuggestion ) => linkSuggestion.id !== this._currentPostId );
	}

	/**
	 * Adds to each link suggestion if it has been used or not.
	 *
	 * @param {Array} linkSuggestions The current link suggestions.
	 * @returns {Array} The link suggestions with marks if links are used.
	 */
	markUsedLinks( linkSuggestions ) {
		let usedLinks = this.usedLinks || [];
		forEach( linkSuggestions, function( linkSuggestion ) {
			linkSuggestion.active = includes( usedLinks, linkSuggestion.link );
		} );
		return linkSuggestions;
	}

	/**
	 * Dispatches an action to update the linkSuggestions.
	 *
	 * @returns {void}
	 */
	updateStore( linkSuggestions ) {
		this.linkSuggestions = linkSuggestions;
		linkSuggestions = this.filterCurrentPost( this.linkSuggestions );
		linkSuggestions = this.markUsedLinks( this.linkSuggestions );
		linkSuggestions = this.constructor.mapSuggestionsForStore( linkSuggestions );

		this.store.setLinkSuggestions( linkSuggestions, this.showUnindexedWarning );
	}
}

export default linkSuggester;
