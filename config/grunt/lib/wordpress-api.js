const fetch = require( "node-fetch" );

/**
 * Calls the wordpress API
 *
 * @param {string} path The path to call for instance: worpress verion core/version-check/1.7/ 
 * @param {Object} body The body data to send.
 * @param {string} [method] Optional. The request method, "POST", "GET", "PATCH".
 *
 * @returns {Promise<Object>} Response object.
 */
async function wordpressApi( path, body, method = "GET" ) {
	
	const apiRoot = "https://api.wordpress.org/";
	const apiUrl = `${ apiRoot }${ path }`;
	const config = {
		method: method,
		headers: {
			"Content-Type": "application/json",
		},
	};
	if ( method !== "GET" && method !== "HEAD" ) {
		config.body = JSON.stringify( body );
	}

	return await fetch( apiUrl, config );
}

module.exports = wordpressApi;
