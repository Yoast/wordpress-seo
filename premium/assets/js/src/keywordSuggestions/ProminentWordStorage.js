import ProminentWordCache from "./ProminentWordCache";

/**
 * Handles the retrieval and storage of focus keyword suggestions
 */
class ProminentWordStorage {

	/**
	 * @param {string} rootUrl The root URL of the WP REST API.
	 * @param {string} nonce The WordPress nonce required to save anything to the REST API endpoints.
	 * @param {number} postID The postID of the post to save prominent words for.
	 */
	constructor( { postID, rootUrl, nonce } ) {
		this._rootUrl = rootUrl;
		this._nonce = nonce;
		this._cache = new ProminentWordCache();
		this._postID = postID;
		this._savingProminentWords = false;

		this.retrieveProminentWordId = this.retrieveProminentWordId.bind( this );
	}

	/**
	 * Saves prominent words to the database using AJAX
	 *
	 * @param {WordCombination[]} prominentWords The prominent words to save.
	 * @returns {Promise}
	 */
	saveProminentWords( prominentWords ) {
		// If there is already a save sequence in progress, don't do it again.
		if ( this._savingProminentWords ) {
			return;
		}
		this._savingProminentWords = true;

		let prominentWordIds = prominentWords.slice( 0, 20 ).map( this.retrieveProminentWordId );

		return Promise.all( prominentWordIds ).then( ( prominentWords ) => {
			jQuery.ajax( {
				type: "POST",
				url: this._rootUrl + "wp/v2/posts/" + this._postID,
				beforeSend: ( xhr ) => {
					xhr.setRequestHeader( "X-WP-Nonce", this._nonce );
				},
				data: {
					// eslint-disable-next-line camelcase
					yst_prominent_words: prominentWords,
				},
				dataType: "json",
			} ).always( () => {
				this._savingProminentWords = false;
			} );
		} );
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
