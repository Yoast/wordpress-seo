import apiFetch from "@wordpress/api-fetch";

/**
 * Wraps the API requests and handles the API responses.
 *
 * @param {Function} apiRequest        The API request function call to handle.
 * @param {Function} onSuccessCallback The callback to run on a successful response.
 * @param {Function} onFailureCallback The callback to run on a failed response.
 * @param {number} expectedStatusCode  The expected status code to run the success callback on.
 *
 * @returns {Promise} The handled response promise.
 */
export async function handleAPIResponse( apiRequest, onSuccessCallback, onFailureCallback, expectedStatusCode = 200 ) {
	try {
		const response = await apiRequest();

		if ( response.status === expectedStatusCode ) {
			return onSuccessCallback( response );
		}

		return onFailureCallback( response );
	} catch ( e ) {
		console.error( e.message );
	}
}

/**
 * Calls the passed endpoint and handles any potential errors.
 *
 * @param {Object} endpoint The endpoint object.
 *
 * @returns {Promise} The API response promise.
 */
export async function callEndpoint( endpoint  ) {
	try {
		return await apiFetch( endpoint );
	} catch ( e ) {
		// If the error object looks like what we expect, return it.
		if ( e.error && e.status ) {
			return e;
		}

		// Sometimes we get a Response instance back instead of the data itself.
		if ( e instanceof Response ) {
			return await e.json();
		}

		// Likely some type of connection error.
		return {
			status: 0,
			error: e.message,
		};
	}
}
