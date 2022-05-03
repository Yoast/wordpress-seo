/**
 * Perform a (promisified) ajax request.
 *
 * @param {string} method  HTTP Method ( i.e. "POST" or "GET" ).
 * @param {string} url     Ajax url.
 * @param {string} nonce   WordPress nonce, can be null.
 * @param {any}    payload Request payload.
 *
 * @returns {Promise} A promise.
 */
export function doAjaxRequest( method, url, nonce, payload ) {
	return new Promise( ( resolve, reject ) => {
		jQuery.ajax( {
			type: method,
			url,
			beforeSend: nonce ? ( xhr ) => {
				xhr.setRequestHeader( "X-WP-Nonce", nonce );
			} : null,
			data: payload,
			dataType: "json",
			success: resolve,
			error: reject,
		} );
	} );
}
