/**
 * A key value store for prominent words to their respective IDs.
 */
class ProminentWordCache {

	/**
	 * Sets the initial cache.
	 */
	constructor() {
		this._cache = {};
	}

	/**
	 * Returns the ID given the name, or 0 if not found in the cache.
	 *
	 * @param {string} name The name of the prominent word.
	 * @returns {number} The ID of the prominent word.
	 */
	getID( name ) {
		if ( this._cache.hasOwnProperty( name ) ) {
			return this._cache[ name ];
		}

		return 0;
	}

	/**
	 * Sets the ID for a given name.
	 *
	 * @param {string} name The name of the prominent word.
	 * @param {number} id The ID of the prominent word.
	 * @returns {void}
	 */
	setID( name, id ) {
		this._cache[ name ] = id;
	}
}

export default ProminentWordCache;
