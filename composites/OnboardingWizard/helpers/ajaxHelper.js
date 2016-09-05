import "whatwg-fetch";

/**
 * Handles json request the fetch way.
 *
 * @param {string} url  The endpoint to send the data to.
 * @param {Object} data The JSON object to send to the server.
 * @param {string} method The method to use for the request for example GET, POST or PUT.
 *
 * @returns {Promise} A Promise, if the request is successful the promise is resolved, else it's rejected.
 */
let sendFetchRequest = ( url, data, method ) => {
	let fetchPromise = fetch(
		url,
		{
			method,
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
 * @param {string} dataType The format the data is send in.
 * @param {string} method The method to use for the request for example GET, POST or PUT.
 *
 * @returns {Promise} A Promise, if the request is successful the promise is resolved, else it's rejected.
 */
let sendJQueryRequest = ( url, headers, data, dataType, method ) => {
	return new Promise( ( resolve, reject )=> {
		jQuery.ajax( {
			method,
			url,
			dataType,
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
 * @param {string} dataType The format the data is send in.
 * @param {string} method The method to use for the request for example GET, POST or PUT.
 *
 * @returns {Promise} Returns a wrapped promise.
 */
let sendRequest = ( url, data = {}, headers = {} , dataType = "json", method = "PUT") => {
	if(dataType === "json"){
		data = JSON.stringify( data );
	}

	if ( typeof jQuery === "undefined" || ! jQuery || ! jQuery.ajax ) {
		return sendFetchRequest( url, data , method );
	}

	return sendJQueryRequest( url, headers, data, dataType, method );
};

export default sendRequest;
