/**
 * @param {string|URL} url The URL to fetch from.
 * @param {RequestInit} options The request options.
 * @returns {Promise<any|Error>} The promise of a result, or an error.
 */
export const fetchJson = async( url, options ) => {
	try {
		const response = await fetch( url, options );
		if ( ! response.ok ) {
			const error = new Error( response.statusText );
			error.status = response.status;
			throw error;
		}
		return response.json();
	} catch ( e ) {
		return Promise.reject( e );
	}
};
