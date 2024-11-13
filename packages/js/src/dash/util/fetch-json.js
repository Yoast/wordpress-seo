/**
 * @param {string|URL} url The URL to fetch from.
 * @param {RequestInit} requestInit The request options.
 * @returns {Promise<any|Error>} The promise of a result, or an error.
 */
export const fetchJson = async( url, requestInit ) => {
	try {
		const response = await fetch( url, requestInit );
		if ( ! response.ok ) {
			// From the perspective of the results, we want to reject this as an error.
			throw new Error( "Not ok" );
		}
		return response.json();
	} catch ( error ) {
		return Promise.reject( error );
	}
};
