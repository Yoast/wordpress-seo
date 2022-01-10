import { isArray } from "lodash-es";
import {callEndpoint} from './api';

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

/**
 * Tracks all available keyphrases
 *
 * @returns {Promise} The API response promise.
 */
export async function trackAllKeyphrases() {
	return await callEndpoint( {
		path: "yoast/v1/wincher/keyphrases/track/all",
		method: "POST",
	} );
}
