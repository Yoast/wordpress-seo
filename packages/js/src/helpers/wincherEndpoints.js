import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";
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
		// Assume it's a valid API call.
		return e;
	}
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
 * Gets the chart data for the tracked keyphrases.
 *
 * @param {Array}  keyphrases The keyphrases used in the post.
 * @param {string} permalink  The post's/page's permalink. Optional.
 *
 * @returns {Promise} The API response promise.
 */
export async function getKeyphrasesChartData( keyphrases = [], permalink = "" ) {
	return await callEndpoint( {
		path: "yoast/v1/wincher/keyphrases/chart",
		method: "POST",
		data: {
			keyphrases,
			permalink,
		},
	} );
}

/**
 * Gets the tracked keyphrases data via POST.
 *
 * @param {Array}   keyphrases     The keyphrases to get the data for.
 * @param {boolean} includeRanking Whether ranking data should be included.
 *
 * @returns {Promise} The API response promise.
 */
export async function getKeyphrases( keyphrases = [], includeRanking = false ) {
	return await callEndpoint( {
		path: "yoast/v1/wincher/keyphrases",
		method: "POST",
		data: {
			keyphrases,
			includeRanking,
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
