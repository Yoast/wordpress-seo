import ProminentWordCache from "./ProminentWordCache";
import EventEmitter from "events";
import isEqual from "lodash/isEqual";

/**
 * Handles the retrieval and storage of focus keyword suggestions
 */
class ProminentWordStorage extends EventEmitter {
	/**
	 * @param {string} rootUrl The root URL of the WP REST API.
	 * @param {string} nonce The WordPress nonce required to save anything to the REST API endpoints.
	 * @param {string} postSaveEndpoint The endpoint to use to save the post.
	 * @param {string} postTypeBase The base of the post type to use in the REST API URL.
	 * @param {number} postID The postID of the post to save prominent words for.
	 * @param {ProminentWordCache} cache The cache to use for the prominent word term IDs.
	 */
	constructor( { postID, rootUrl, nonce, postSaveEndpoint = "", postTypeBase = null, cache = null } ) {
		super();

		this._rootUrl = rootUrl;
		this._nonce = nonce;
		this._postID = postID;
		this._savingProminentWords = false;
		this._previousProminentWords = null;

		this._postSaveEndpoint = postSaveEndpoint;
		if ( postTypeBase !== null ) {
			this._postSaveEndpoint = this._rootUrl + "wp/v2/" + postTypeBase + "/" + this._postID;
		}

		if ( cache === null ) {
			cache = new ProminentWordCache();
		}
		this._cache = cache;

		this.retrieveProminentWordId = this.retrieveProminentWordId.bind( this );
	}

	/**
	 * Saves prominent words to the database using AJAX
	 *
	 * @param {WordCombination[]} prominentWords The prominent words to save.
	 * @returns {Promise} Resolves when the prominent words are saved.
	 */
	saveProminentWords( prominentWords ) {
		// If there is already a save sequence in progress, don't do it again.
		if ( this._savingProminentWords ) {
			return;
		}
		this._savingProminentWords = true;

		let firstTwentyWords = prominentWords.slice( 0, 20 );

		// Retrieve IDs of all prominent word terms, but do it in sequence to prevent overloading servers.
		let prominentWordIds = firstTwentyWords.reduce( ( previousPromise, prominentWord ) => {
			return previousPromise.then( ( ids ) => {
				return this.retrieveProminentWordId( prominentWord ).then( ( newId ) => {
					ids.push( newId );

					return ids;

				// On error, just continue with the other terms.
				}, () => {
					return ids;
				} );
			} );
		}, Promise.resolve( [] ) );

		return prominentWordIds.then( ( prominentWords ) => {
			if ( isEqual( prominentWords, this._previousProminentWords ) ) {
				this._savingProminentWords = false;
				return Promise.resolve();
			}
			this._previousProminentWords = prominentWords;

			return new Promise( ( resolve, reject ) => {
				jQuery.ajax( {
					type: "POST",
					url: this._postSaveEndpoint,
					beforeSend: ( xhr ) => {
						xhr.setRequestHeader( "X-WP-Nonce", this._nonce );
					},
					data: {
						// eslint-disable-next-line camelcase
						yst_prominent_words: prominentWords,
					},
					dataType: "json",
					success: resolve,
					error: reject,
				} ).always( () => {
					this.emit( "savedProminentWords", prominentWords );

					this._savingProminentWords = false;
				} );
			} );
		} ).catch( (e) => {} );
	}

	/**
	 * Retrieves the ID of a promise
	 *
	 * @param {WordCombination} prominentWord The prominent word to retrieve the ID for.
	 * @returns {Promise} Resolves to the ID of the prominent word term.
	 */
	retrieveProminentWordId( prominentWord ) {
		let cachedId = this._cache.getID( prominentWord.getCombination() );
		if ( 0 !== cachedId ) {
			return Promise.resolve( cachedId );
		}

		let foundProminentWord = new Promise( ( resolve, reject ) => {
			jQuery.ajax( {
				type: "GET",
				url: this._rootUrl + "yoast/v1/prominent_words",
				beforeSend: ( xhr ) => {
					xhr.setRequestHeader( "X-WP-Nonce", this._nonce );
				},
				data: {
					word: prominentWord.getCombination(),
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

		let createdProminentWord = foundProminentWord.then( ( prominentWordTerm ) => {
			if ( prominentWordTerm === null ) {
				return this.createProminentWordTerm( prominentWord );
			}

			return prominentWordTerm;
		} );

		return createdProminentWord.then( ( prominentWordTerm ) => {
			this._cache.setID( prominentWord.getCombination(), prominentWordTerm.id );

			return prominentWordTerm.id;
		} );
	}

	/**
	 * Creates a term for a prominent word
	 *
	 * @param {WordCombination} prominentWord The prominent word to create a term for.
	 * @returns {Promise} A promise that resolves when a term has been created and resolves with the ID of the newly created term.
	 */
	createProminentWordTerm( prominentWord ) {
		return new Promise( ( resolve, reject ) => {
			jQuery.ajax( {
				type: "POST",
				url: this._rootUrl + "wp/v2/yst_prominent_words",
				beforeSend: ( xhr ) => {
					xhr.setRequestHeader( "X-WP-Nonce", this._nonce );
				},
				data: {
					name: prominentWord.getCombination(),
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
}

export default ProminentWordStorage;
