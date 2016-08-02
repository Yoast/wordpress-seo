
import 'whatwg-fetch';

let postJSONRequest = null;

if( typeof jQuery === typeof undefined && typeof jQuery.ajax === typeof null) {

	/**
	 * Wrapper method when fetch should be used.
	 *
	 * @param {string}   url     The endpoint to send the data to.
	 * @param {Object}   data    The JSON object to send to the server.
	 * @param {function} success Callback for When the request is successful.
	 * @param {function} error   Callback for When the request is failed.
	 */
	postJSONRequest = ( url, data, success, error ) => {
		fetch(
			url,
			{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: data
			}
		)
		.then( success )
		.catch( error )
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
	postJSONRequest = ( url, data, success, error ) => {
		let contentType = "application/json";
		let method = "POST";

		jQuery.ajax( { url, data, success, error, contentType, method } );
	}

}

export default postJSONRequest;
