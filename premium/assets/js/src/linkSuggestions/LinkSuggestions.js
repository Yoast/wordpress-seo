import React from "react";
import ReactDOM from "react-dom";
import isEqual from "lodash/isEqual";
import forEach from "lodash/forEach";
import includes from "lodash/includes";
import EventEmitter from "events";
import LinkSuggestionsMetabox from "./Metabox";

class LinkSuggestions extends EventEmitter {

	/**
	 * Constructs the object that handles the link suggestions meta box.
	 *
	 * @param {string} target The DOM element of the meta box.
	 * @param {string} rootUrl The root URL to do AJAX requests to.
	 * @param {string} nonce The nonce to use when sending requests to the REST API.
	 * @param {number} currentPostId The post ID of the post we are currently displaying.
	 * @param {boolean} showUnindexedWarning Whether to show a warning about posts not being indexed yet.
	 */
	constructor( { target, rootUrl, nonce, currentPostId, showUnindexedWarning } ) {
		super();

		this._target = target;
		this._rootUrl = rootUrl;
		this._nonce = nonce;
		this._previousProminentWords = false;
		this._currentPostId = currentPostId;
		this._isLoading = false;
		this._showUnindexedWarning = showUnindexedWarning;
		this.render = this.render.bind( this );
		this.filterCurrentPost = this.filterCurrentPost.bind( this );

		jQuery( window ).on( "YoastSEO:numericScore", this.updateUsedLinks.bind( this ) );
	}

	/**
	 * Initializes the React link suggestions root.
	 *
	 * @param {Array} currentLinkSuggestions The link suggestions currently known on the server.
	 * @returns {void}
	 */
	initializeDOM( currentLinkSuggestions ) {

		// If the server has no cached suggestions, we want to show a loader.
		if ( currentLinkSuggestions === false ) {
			currentLinkSuggestions = [];
			this._isLoading = true;
		}

		currentLinkSuggestions = this.filterCurrentPost( currentLinkSuggestions );
		this.saveLinkSuggestions( currentLinkSuggestions );
		currentLinkSuggestions = this.markUsedLinks( currentLinkSuggestions );
		currentLinkSuggestions = this.constructor.mapSuggestionsForComponent( currentLinkSuggestions );

		let metabox = (
			<LinkSuggestionsMetabox linkSuggestions={this}
			                        suggestions={currentLinkSuggestions}
			                        isLoading={this._isLoading}
			                        showUnindexedWarning={this._showUnindexedWarning} />
		);

		ReactDOM.render( metabox, this._target );
	}

	/**
	 * Handles changed prominent words, makes sure they are actually changed. If so, retrieve new link suggestions.
	 *
	 * @param {number[]} prominentWords The new prominent words IDs.
	 * @returns {void}
	 */
	updatedProminentWords( prominentWords ) {
		this._isLoading = false;
		if ( ! isEqual( this._previousProminentWords, prominentWords ) ) {
			this._previousProminentWords = prominentWords;

			this.retrieveLinkSuggestions( prominentWords )
				.then( this.filterCurrentPost )
				.then (this.saveLinkSuggestions.bind( this ) );
		}
	}

	/**
	 * Saves the link suggestions before rendering.
	 *
	 * @param {array} linkSuggestions The array with link suggestions.
	 *
	 * @returns {void}
	 */
	saveLinkSuggestions( linkSuggestions ) {
		this.linkSuggestions = linkSuggestions;
		this.render();
	}

	/**
	 * Updates the used links so they can be marked when rendering.
	 *
	 * @returns {void}
	 */
	updateUsedLinks() {
		this.usedLinks = YoastSEO.app.researcher.getResearch( "getLinks" );
		this.render();
	}

	/**
	 * The component excepts different keys than we get from the API, so map to the component's expectation.
	 *
	 * @param {Array} linkSuggestions Current link suggestions.
	 * @returns {Array} The map link suggestions.
	 */
	static mapSuggestionsForComponent( linkSuggestions ) {
		return linkSuggestions.map( ( linkSuggestion ) => {
			return {
				value: linkSuggestion.title,
				url: linkSuggestion.link,
				isActive: linkSuggestion.active,
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
		forEach( linkSuggestions, function( linkSuggestion ){
			linkSuggestion.active = includes( usedLinks, linkSuggestion.link );
		});
		return linkSuggestions;
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
	 * Emits an event suggesting we can now render link suggestions.
	 *
	 * @param {Array} suggestions The actual link suggestions.
	 * @returns {void}
	 */
	render() {
		let linkSuggestions = this.markUsedLinks( this.linkSuggestions );

		linkSuggestions = this.constructor.mapSuggestionsForComponent( linkSuggestions );
		this.emit( "retrievedLinkSuggestions", linkSuggestions, this._isLoading );
	}
}

export default LinkSuggestions;
