import 'whatwg-fetch';

let postJSONRequest = null;

//TODO jQuery method shows works differently than whatwg-fetch library. For example whatwg-fetch doesn't throw an error when the endpoints repsonse is forbidden, jquery does.

if ( typeof jQuery == 'undefined' || ! jQuery || ! jQuery.ajax ) {
	/**
	 * Wrapper method when fetch should be used.
	 *
	 * @param {string}   url     The endpoint to send the data to.
	 * @param {Object}   data    The JSON object to send to the server.
	 * @param {function} success Callback for When the request is successful.
	 * @param {function} error   Callback for When the request is failed.
	 */
	postJSONRequest = ( url, data = {} ) => {
		return fetch(
			url,
			{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify( data )
			}
		)
	};
}
else {
	/**
	 * Wrapper method for doing request when jQuery is active.
	 *
	 * @param {string}   url     The endpoint to send the data to.
	 * @param {Object}   data    The JSON object to send to the server.
	 * @param {function} success Callback for When the request is successful.
	 * @param {function} error   Callback for When the request is failed.
	 */
	postJSONRequest = ( url, data = {} ) => {
		let method = 'POST';
		let accepts = 'application/json';

		let jsonData = JSON.stringify( data );

		return jQuery.ajax( { url, accepts, jsonData, method } );
	}

}

export default postJSONRequest;
