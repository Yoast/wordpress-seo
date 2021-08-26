import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";
import {isArray} from "lodash-es";

/**
 * Calls the passed endpoint and handles any potential errors.
 *
 * @param {Object}   endpoint     The endpoint object.
 *
 * @returns {Promise} The API response promise.
 */
export async function callEndpoint( endpoint  ) {
	try {
		return await apiFetch( endpoint );
	} catch ( e ) {
		console.error( e.message );
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
 * @param {Array} keyphrases The keyphrases used in the post.
 *
 * @returns {Promise} The API response promise.
 */
export async function getKeyphrasesChartData( keyphrases = [] ) {
	const preparedKeyphrases = encodeURIComponent( JSON.stringify( keyphrases ) );

	return await callEndpoint( {
		path: addQueryArgs(
			"yoast/v1/wincher/keyphrases/chart",
			{
				keyphrases: preparedKeyphrases,
			}
		),
		method: "GET",
	} );
}

/**
 * Gets the tracked keyphrases data.
 *
 * @param {Array} keyphrases The keyphrases to get the data for.
 *
 * @returns {Promise} The API response promise.
 */
export async function getKeyphrases( keyphrases = [] ) {
	const preparedKeyphrases = encodeURIComponent( JSON.stringify( keyphrases ) );

	return await callEndpoint( {
		path: addQueryArgs(
			"yoast/v1/wincher/keyphrases",
			{
				keyphrases: preparedKeyphrases,
			}
		),
		method: "GET",
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
