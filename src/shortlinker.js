export default class Shortlinker {
	/**
	 * Initialize the Shortlinker class.
	 *
	 * @param {Object} config        The configuration.
	 * @param {Object} config.params The params to create the query string with.
	 */
	constructor( config = {} ) {
		this._config = {
			params: {},
			...config,
		};
	}

	/**
	 * Creates a query string from a params object.
	 *
	 * @param {Object} params Params for in the query string.
	 *
	 * @returns {string} URI encoded query string.
	 */
	static createQueryString( params ) {
		return Object.keys( params ).map( key => `${ encodeURIComponent( key ) }=${ params[ encodeURIComponent( key ) ] }` ).join( "&" );
	}

	/**
	 * Creates a shortlink using the params from the config.
	 *
	 * @param {string} url The base url.
	 *
	 * @returns {string} The shortlink with query string.
	 */
	create( url ) {
		const queryString = self.createQueryString( this._config.params );
		return url + "?" + queryString;
	}
}
