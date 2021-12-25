import {callEndpoint} from './wincherEndpoints';

/**
 * Returns the authorization data.
 *
 * @returns {Promise} The API response promise.
 */
export async function getAuthorization() {
	return await callEndpoint( {
		path: "yoast/v1/wordproof/authentication",
		method: "GET",
	} );
}
