import {WINCHER_SET_TRACK_ALL_REQUEST} from "./WincherSEOPerformance";

export const WINCHER_SET_REQUEST_SUCCEEDED = "WINCHER_SET_REQUEST_SUCCEEDED";
export const WINCHER_SET_REQUEST_FAILED = "WINCHER_SET_REQUEST_FAILED";
export const WINCHER_SET_REQUEST_LIMIT_REACHED = "WINCHER_SET_LIMIT_REACHED";
export const WINCHER_NEW_REQUEST = "WINCHER_NEW_REQUEST";
export const WINCHER_NO_DATA_FOUND = "WINCHER_NO_DATA_FOUND";
export const WINCHER_SET_LOGIN_STATUS = "WINCHER_SET_LOGIN_STATUS";

/**
 * An action creator for starting a new request.
 *
 * @param {string} keyphrase The keyphrase for the Wincher request.
 *
 * @returns {Object} Action object.
 */
export function setWincherNewRequest( keyphrase ) {
	return {
		type: WINCHER_NEW_REQUEST,
		keyphrase,
	};
}

/**
 * An action creator for when the request has succeeded.
 *
 * @param {Object} response The response of the request.
 *
 * @returns {Object} Action object.
 */
export function setWincherRequestSucceeded( response ) {
	return {
		type: WINCHER_SET_REQUEST_SUCCEEDED,
		response,
	};
}

/**
 * An action creator for when the request has failed.
 *
 * @param {Object} response of the request.
 *
 * @returns {Object} Action object.
 */
export function setWincherRequestFailed( response ) {
	return {
		type: WINCHER_SET_REQUEST_FAILED,
		response,
	};
}

/**
 * An action creator for when the request limit has been reached.
 *
 * @param {int} limit The limit assigned to the account.
 *
 * @returns {Object} Action object.
 */
export function setWincherSetRequestLimitReached( limit ) {
	return {
		type: WINCHER_SET_REQUEST_LIMIT_REACHED,
		limit,
	};
}

/**
 * An action creator for when no data is returned from Wincher.
 *
 * @returns {Object} Action object.
 */
export function setWincherNoResultsFound() {
	return {
		type: WINCHER_NO_DATA_FOUND,
	};
}

/**
 * An action creator to check if the user is logged in to Wincher.
 *
 * @param {boolean} loginStatus        The login status.
 * @param {boolean} newlyAuthenticated Whether the login attempt is based on a new OAuth connection.
 *
 * @returns {Object} Action object.
 */
export function setWincherLoginStatus( loginStatus, newlyAuthenticated ) {
	return {
		type: WINCHER_SET_LOGIN_STATUS,
		loginStatus,
		newlyAuthenticated,
	};
}

/**
 * Tracks all keyphrases associated with the current article.
 *
 * @returns {Object} Action object.
 */
export function trackAllKeyphrases() {
	return {
		type: WINCHER_SET_TRACK_ALL_REQUEST,
	};
}
