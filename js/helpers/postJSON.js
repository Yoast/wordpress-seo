import 'whatwg-fetch';

let postJSON = null;

/*
 *  The jQuery method shows works differently than whatwg-fetch library. For example whatwg-fetch doesn't throw an error
 *  when the endpoints response is forbidden, jQuery does.
 *
 *  @todo: Change the handling of the response for fetch and for jQuery.
 */

/**
 *
 * @return {Promise}
 */
let postJSONFetch = ( url, data ) => {

	/*
	 * @todo: It might be possible fetch is sending an OPTIONS request, we should check how wordpress handles this.
	 *
	 * Possible cause: maybe its the stubby server, something with cross-domain requests.
	 *
	 */
	let fetchPromise = fetch(
		url,
		{
			method: 'POST',
			headers: {
				'Accepts': 'application/json',
				'Content-Type': 'application/json'
			},
			body: data
		}
	);

	return new Promise(
		function( resolve, reject ) {

			fetchPromise
				.then(
					function( response ) {
						if( response.status === 200 ) {
							return resolve( response.json() );
						}

						return reject( "Response status is not 200" );
					}
				)
				.catch(
					function() {
						return reject( 'Wrong request' );
					}
				);
		}
	);

};

/**
 * @return {Promise}
 */
let postJSONjQuery = ( url, data ) => {

	let jQueryPromise = jQuery.post( { url, dataType : 'json', data } )
		.done(
			function ( response ) {
				return response;
			}
		)
		.fail(
			function() {
				return 'Wrong request';
			}
		);

	return new Promise(
		function( resolve, reject ) {
			jQueryPromise
				.then(
					function( response ) {
						return resolve( response );
					}
				)
				.catch(
					function() {
						return reject( 'Wrong request' );
					}
				);
		}
	);
};




/**
 * Wrapper method when fetch should be used.
 *
 * @param {string} url  The endpoint to send the data to.
 * @param {Object} data The JSON object to send to the server.
 *
 * @return {Promise}
 */
postJSON = ( url, data = {} ) => {
	data = JSON.stringify( data );

	//
	if ( typeof jQuery == 'undefined' || ! jQuery || ! jQuery.ajax ) {
		return postJSONFetch( url, data );
	}

	return postJSONjQuery( url, data );
};

export default postJSON;
