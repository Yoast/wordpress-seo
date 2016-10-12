import "whatwg-fetch";

/**
 * Handles json request the fetch way.
 *
 * @param {string} url  The endpoint to send the data to.
 * @param {object} requestParams The arguments/settings for sending the request.
 *
 * @returns {Promise} A Promise, if the request is successful the promise is resolved, else it's rejected.
 */
let sendFetchRequest = ( url, requestParams ) => {
	let fetchPromise = fetch(
		url,
		requestParams
	);

	return new Promise(
		( resolve, reject ) => {
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
 * @param {object} requestParams The arguments/settings for sending the request.
 *
 * @returns {Promise} A Promise, if the request is successful the promise is resolved, else it's rejected.
 */
let sendJQueryRequest = ( url, requestParams ) => {
	Object.assign( requestParams, { url } );

	return new Promise( ( resolve, reject )=> {
		jQuery.ajax( requestParams )
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
 * Parses the headers so the can be used for jQuery or Fetch.
 *
 * @param type The type of headers, "jquery" or "fetch".
 * @param config The config containing the headers.
 */
var parseHeaders = ( type, config ) => {
	if ( type === "jquery" ) {
		Object.assign( config, {
			beforeSend: ( xhr ) => {
				jQuery.each( config.headers, ( headerName, headerValue ) => {
					xhr.setRequestHeader( headerName, headerValue );
				} );
			},
		} );
	}
	if ( type === "fetch" && config.dataType === "json" ) {
		Object.assign( config.headers, {
			Accepts: "application/json",
			"Content-Type": "application/json",
		} );
	}
};

/**
 * @summary Parses the arguments needed for sending a JSON or Fetch request.
 *
 * @param requestArgs The arguments for the request.
 * @param type The type of request, can be: "jquery" or "fetch".
 * @returns {object} Containing the parsed arguments for a request
 *                   with either jQuery or Fetch.
 */
let parseRequestArgs = ( requestArgs, type ) => {
	let defaults = {
		dataType: "json",
		method: "PUT",
		contentType: "application/json",
	};

	let config = requestArgs;

	for ( var key in defaults ) {
		if ( defaults.hasOwnProperty( key ) ) {
			if( typeof config[ key ] === "undefined" || config[ key ] === "" ) {
				config[ key ] = defaults[ key ];
			}
		}
	}

	if ( typeof config.headers !== "undefined" || config.headers !== "" ) {
		parseHeaders( type, config );
	}

	if( config.dataType === "json" ) {
		config.data = JSON.stringify( config.data );
	}

	if ( type === "fetch" ) {
		Object.assign( config, {
			body: config.data,
		}
		);
	}

	return config;
};

/**
 * Wrapper method when fetch should be used.
 *
 * @param {string} url  The endpoint to send the data to.
 * @param {object} args The arguments/settings for sending the request.
 *
 * @returns {Promise} Returns a wrapped promise.
 */
let sendRequest = ( url, args ) => {
	if ( typeof jQuery === "undefined" || ! jQuery || ! jQuery.ajax ) {
		let requestArgs = parseRequestArgs( args, "fetch" );

		return sendFetchRequest( url, requestArgs );
	}

	let requestArgs = parseRequestArgs( args, "jquery" );

	return sendJQueryRequest( url, requestArgs );
};

export default sendRequest;
