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
	let fetchPromise = fetch(
		url,
		{
			method: "PUT",
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
 * @param {object} headers Object containing the headers for the request.
 * @param {Object} data The JSON object to send to the server.
 *
 * @returns {Promise} A Promise, if the request is successful the promise is resolved, else it's rejected.
 */
let postJSONjQuery = ( url, headers, data ) => {
	return new Promise( ( resolve, reject )=> {
		jQuery.ajax( {
			method: "PUT",
			url,
			dataType: "json",
			contentType : 'application/json',
			beforeSend: function ( xhr ) {
				jQuery.each( headers, (headerName, headerValue) => {
					xhr.setRequestHeader(headerName, headerValue);
				});
			},
			data
		} )
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
};

/**
 * Wrapper method when fetch should be used.
 *
 * @param {string} url  The endpoint to send the data to.
 * @param {object} headers Object containing the headers for the request.
 * @param {Object} data The JSON object to send to the server.
 *
 * @returns {Promise} Returns a wrapped promise.
 */
let postJSON = ( url, headers = {}, data = {} ) => {
	data = JSON.stringify( data );

	if ( typeof jQuery === "undefined" || ! jQuery || ! jQuery.ajax ) {
		return postJSONFetch( url, data );
	}

	return postJSONjQuery( url, headers, data );
};

export default postJSON;
