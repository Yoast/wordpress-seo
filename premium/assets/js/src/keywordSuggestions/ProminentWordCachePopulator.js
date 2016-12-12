import unescape from "lodash/unescape";

/**
 * Populates a prominent word cache with data from the server.
 */
class ProminentWordCachePopulator {

	/**
	 * Sets the instance attributes.
	 *
	 * @param {ProminentWordCache} cache The cache to populate.
	 * @param {RestApi} restApi The REST API object to do requests with.
	 */
	constructor( { cache, restApi } ) {
		this._cache = cache;
		this._restApi = restApi;
		this._currentPage = 1;

		this.processProminentWord = this.processProminentWord.bind( this );
	}

	/**
	 * Populates the prominent word cache with data from the server.
	 *
	 * @returns {Promise} Resolves when the cache has been populated.
	 */
	populate() {
		let data = {
			per_page: 100,
			page: this._currentPage,
		};

		return this._restApi.get( "wp/v2/yst_prominent_words", { data } ).then( ( result ) => {
			if ( result.length === 0 ) {
				return;
			}

			result.forEach( this.processProminentWord );

			this._currentPage += 1;

			return this.populate();
		} );
	}

	/**
	 * Saves a prominent word to the cache.
	 *
	 * @param {Object} prominentWord The prominent word to save to the cache.
	 * @returns {void}
	 */
	processProminentWord( prominentWord ) {
		let name = unescape( prominentWord.name );

		this._cache.setID( name, prominentWord.id );
	}
}

export default ProminentWordCachePopulator;
