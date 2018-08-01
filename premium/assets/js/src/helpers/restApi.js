/**
 * A helper class to do AJAX requests to the REST API.
 */
class RestApi {

	/**
	 * Constructs a RestApi request helper object.
	 *
	 * @param {string} rootUrl The root URL of the REST API.
	 * @param {string} nonce The nonce to authenticate to the REST API using cookies.
	 */
	constructor( { rootUrl, nonce } ) {
		this._rootUrl = rootUrl;
		this._nonce = nonce;
	}

	/**
	 * Does a GET request to the REST API
	 *
	 * @param {string} path The path to do the request to.
	 * @param {Object} params The parameters to use for jQuery.
	 * @returns {Promise} Resolves when the AJAX request is complete.
	 */
	get( path, params ) {
		params = Object.assign( params, {
			type: "GET",
			url: this._rootUrl + path,
		} );

		return this.request( params );
	}

	/**
	 * Does a POST request to the REST API
	 *
	 * @param {string} path The path to do the request to.
	 * @param {Object} params The parameters to use for jQuery.
	 * @returns {Promise} Resolves when the AJAX request is complete.
	 */
	post( path, params ) {
		params = Object.assign( params, {
			type: "POST",
			url: this._rootUrl + path,
		} );

		return this.request( params );
	}

	/**
	 * Do a request to the REST API
	 *
	 * @param {Object} params The params to use for jQuery.
	 * @returns {Promise} Resolves when the AJAX request is complete.
	 */
	request( params ) {
		return new Promise( ( resolve, reject ) => {
			params = Object.assign( params, {
				beforeSend: ( xhr ) => {
					xhr.setRequestHeader( "X-WP-Nonce", this._nonce );
				},
				success: resolve,
				error: reject,
			} );

			jQuery.ajax( params );
		} );
	}
}

export default RestApi;


