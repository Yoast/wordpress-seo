import apiFetch from "@wordpress/api-fetch";
import { isArray } from "lodash-es";

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
 * Returns the authorization URL.
 *
 * @returns {Promise} The API response promise.
 */
export async function getAuthorizationUrl() {
	return await callEndpoint( {
		path: "yoast/v1/wincher/authorization-url",
		method: "GET",
	} );
}

/**
 * Authenticates the user with Wincher's OAuth server.
 *
 * @param {Object} responseData The message response data.
 *
 * @returns {Promise} The API response promise.
 */
export async function authenticate( responseData ) {
	const { code, websiteId } = responseData;

	return await callEndpoint( {
		path: "yoast/v1/wincher/authenticate",
		method: "POST",
		data: { code, websiteId },
	} );
}

/**
 * Gets the tracked keyphrases data via POST.
 *
 * @param {Array}   keyphrases     The keyphrases to get the data for.
 * @param {String}  permalink  The post's/page's permalink. Optional.
 *
 * @returns {Promise} The API response promise.
 */
export async function getKeyphrases( keyphrases = null, permalink = null ) {
	return await callEndpoint( {
		path: "yoast/v1/wincher/keyphrases",
		method: "POST",
		data: {
			keyphrases,
			permalink,
		},
	} );
}

/**
 * Gets the currently set limit information associated with the connected Wincher account.
 *
 * @returns {Promise} The API response promise.
 */
export async function getAccountLimits() {
	return await callEndpoint( {
		path: "yoast/v1/wincher/limits",
		method: "GET",
	} );
}

/**
 * Tracks one or more keyphrases.
 *
 * @param {Array|string} keyphrases The keyphrases to track. Can be a string.
 *
 * @returns {Promise} The API response promise.
 */
export async function trackKeyphrases( keyphrases ) {
	if ( ! isArray( keyphrases ) ) {
		keyphrases = [ keyphrases ];
	}

	return await callEndpoint( {
		path: "yoast/v1/wincher/keyphrases/track",
		method: "POST",
		data: { keyphrases },
	} );
}

/**
 * Untracks a keyphrase.
 *
 * @param {string} keyphraseID The keyphrase's ID to untrack.
 *
 * @returns {Promise} The API response promise.
 */
export async function untrackKeyphrase( keyphraseID ) {
	return await callEndpoint( {
		path: "yoast/v1/wincher/keyphrases/untrack",
		method: "DELETE",
		data: { keyphraseID },
	} );
}
