import {callEndpoint} from './wincherEndpoints';

/**
 * Returns the authorization data.
 *
 * @returns {Promise} The API response promise.
 */
export async function getAuthentication() {
	return await callEndpoint( {
		path: "wordproof/v1/authentication",
		method: "GET",
	} );
}
export async function getSettings() {
	return await callEndpoint( {
		path: "wordproof/v1/settings",
		method: "GET",
	} );
}
