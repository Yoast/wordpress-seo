import "whatwg-fetch";

/**
 * Handles json request the fetch way.
 *
 * @param {string} url  The endpoint to send the data to.
 * @param {Object} data The JSON object to send to the server.
 *
 * @returns {Promise} A Promise, if the request is successful the promise is resolved, else it's rejected.
 */
let postJSONFetch = ( url, data ) => {
	/*
	 * @todo: It might be possible fetch is sending an OPTIONS request, we should check how wordpress handles this.
	 *
	 * Possible cause: maybe its the stubby server, something with cross-domain requests.
	 */
	let fetchPromise = fetch(
		url,
		{
			method: "POST",
			headers: {
				Accepts: "application/json",
				"Content-Type": "application/json",
			},
			body: data,
		}
	);

	return new Promise(
		function( resolve, reject ) {
			fetchPromise
				.then(
					( response ) => {
						if ( response.status === 200 ) {
							return resolve( response.json() );
						}

						return reject( "Response status is not 200" );
					}
				)
				.catch(
					() => {
						return reject( "Wrong request" );
					}
				);
		}
	);
};
/**
 * Handles JSON request the jQuery way.
 *
 * @param {string} url  The endpoint to send the data to.
 * @param {Object} data The JSON object to send to the server.
 *
 * @returns {Promise} A Promise, if the request is successful the promise is resolved, else it's rejected.
 */
let postJSONjQuery = ( url, data ) => {
	let promise = new Promise( ( resolve, reject )=> {
		jQuery.post( { url, dataType: "json", data } )
		      .done(
			      ( response ) => {
				      resolve( response );
			      }
		      )
		      .fail(
			      () => {
				      reject( "Wrong request" );
			      }
		      );
	} );
	return promise;
};
/**
 * Wrapper method when fetch should be used.
 *
 * @param {string} url  The endpoint to send the data to.
 * @param {Object} data The JSON object to send to the server.
 *
 * @returns {Promise} Returns a wrapped promise.
 */
let postJSON = ( url, data = {} ) => {
	data = JSON.stringify( data );

	if ( jQuery === "undefined" || ! jQuery || ! jQuery.ajax ) {
		return postJSONFetch( url, data );
	}

	return postJSONjQuery( url, data );
};

export default postJSON;
