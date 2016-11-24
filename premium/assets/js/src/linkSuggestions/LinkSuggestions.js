import React from "react";
import ReactDOM from "react-dom";
import isEqual from "lodash/isEqual";
import EventEmitter from "events";
import LinkSuggestionsMetabox from "./Metabox";

class LinkSuggestions extends EventEmitter {

	/**
	 * Constructs the object that handles the link suggestions meta box.
	 *
	 * @param {string} target The DOM element of the meta box.
	 * @param {string} rootUrl The root URL to do AJAX requests to.
	 * @param {string} nonce The nonce to use when sending requests to the REST API.
	 */
	constructor( { target, rootUrl, nonce } ) {
		super();

		this._target = target;
		this._rootUrl = rootUrl;
		this._nonce = nonce;
		this._previousProminentWords = [];
	}

	/**
	 * Initializes the React link suggestions root.
	 *
	 * @param {Array} currentLinkSuggestions The link suggestions currently known on the server.
	 * @returns {void}
	 */
	initializeDOM( currentLinkSuggestions ) {
		let isLoading = false;

		// If the server has no cached suggestions, we want to show a loader.
		if ( currentLinkSuggestions === false ) {
			currentLinkSuggestions = [];
			isLoading = true;
		}

		currentLinkSuggestions = this.constructor.mapSuggestionsForComponent( currentLinkSuggestions );

		ReactDOM.render( <LinkSuggestionsMetabox linkSuggestions={this} suggestions={currentLinkSuggestions} isLoading={isLoading} />, this._target );
	}

	/**
	 * Handles changed prominent words, makes sure they are actually changed. If so, retrieve new link suggestions.
	 *
	 * @param {int[]} prominentWords The new prominent words.
	 * @returns {void}
	 */
	updatedProminentWords( prominentWords ) {
		if ( ! isEqual( this._previousProminentWords, prominentWords ) ) {
			this._previousProminentWords = prominentWords;

			this.retrieveLinkSuggestions( prominentWords )
				.then( this.constructor.mapSuggestionsForComponent )
				.then( this.render.bind( this ) );
		}
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
			};
		} );
	}

	/**
	 * Retrieves link suggestions based on prominent words using AJAX.
	 *
	 * @param {int[]} prominentWords The prominent words to retrieve link suggestions for.
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

	render( suggestions ) {
		this.emit( "retrievedLinkSuggestions", suggestions );
	}
}

export default LinkSuggestions;
