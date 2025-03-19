import "whatwg-fetch";

/**
 * Handles json request the fetch way.
 *
 * @param {string} url  The endpoint to send the data to.
 * @param {object} requestParams The arguments/settings for sending the request.
 *
 * @returns {Promise} A Promise, if the request is successful the promise is resolved, else it's rejected.
 */
const sendFetchRequest = ( url, requestParams ) => {
	const fetchPromise = fetch(
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
const sendJQueryRequest = ( url, requestParams ) => {
	Object.assign( requestParams, { url } );

	return new Promise( ( resolve, reject ) => {
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
 * @param {string} type The type of headers, "jquery" or "fetch".
 * @param {Object} config The config containing the headers.
 * @returns {void}
 */
const parseHeaders = ( type, config ) => {
	if ( type === "jquery" ) {
		Object.assign( config, {
			/**
			 * Adds configured headers to the request.
			 *
			 * @param {XMLHttpRequest} xhr The XMLHttpRequest object.
			 */
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
 * @summary Takes the target object and overwrites fields that are undefined
 *          or empty with the defaults object values.
 *
 * @param {Object} target    Target to apply default values.
 * @param {Object} defaults Default values.
 * @returns {Object}        Target object with overwritten values.
 */
const overwriteObjectWithDefaultValues = ( target, defaults ) => {
	for ( const key in defaults ) {
		if ( Object.hasOwn( defaults, key ) ) {
			if ( typeof target[ key ] === "undefined" || target[ key ] === "" ) {
				target[ key ] = defaults[ key ];
			}
		}
	}
	return target;
};

/**
 * @summary Parses the arguments needed for sending a JSON or Fetch request.
 *
 * @param {Object} requestArgs The arguments for the request.
 * @param {string} type The type of request, can be: "jquery" or "fetch".
 * @returns {object} Containing the parsed arguments for a request
 *                   with either jQuery or Fetch.
 */
const parseRequestArgs = ( requestArgs, type ) => {
	const defaults = {
		dataType: "json",
		method: "POST",
		contentType: "application/json",
	};

	const config = overwriteObjectWithDefaultValues( requestArgs, defaults );

	if ( typeof config.headers !== "undefined" || config.headers !== "" ) {
		parseHeaders( type, config );
	}

	if ( config.dataType === "json" ) {
		config.data = JSON.stringify( config.data );
	}

	if ( type === "fetch" ) {
		Object.assign( config, { body: config.data } );
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
const sendRequest = ( url, args ) => {
	if ( typeof jQuery === "undefined" || ! jQuery || ! jQuery.ajax ) {
		const fetchRequestArgs = parseRequestArgs( args, "fetch" );

		return sendFetchRequest( url, fetchRequestArgs );
	}

	const jQueryRequestArgs = parseRequestArgs( args, "jquery" );

	return sendJQueryRequest( url, jQueryRequestArgs );
};

export default sendRequest;
